import { Prisma, prisma } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { appErrorToTRPC, protectedProcedure, publicProcedure, router } from "../trpc";

export async function createStudent(
  input: {
    regNo: string;
    name?: string;
    email?: string;
    institutionCode: string;
  },
  db: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const institution = await db.institution.findUnique({
    where: {
      code: input.institutionCode,
    },
  });

  if (!institution) {
    throw new AppError(404, "Institution does not exist");
  }

  const existingStudent = await db.student.findUnique({
    where: {
      regNo: input.regNo,
    },
  });

  if (existingStudent) {
    throw new AppError(
      409,
      "Student with this registration number already exists",
    );
  }

  return db.student.create({
    data: {
      regNo: input.regNo,
      name: input.name,
      email: input.email,
      institutionCode: input.institutionCode,
    },
  });
}

export const studentRouter = router({
  create: publicProcedure
    .input(
      z.object({
        regNo: z.string().trim().min(1),
        name: z.string().trim().optional(),
        email: z.string().trim().email().optional(),
        institutionCode: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await createStudent(input);
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  getInstitutionByRegNo: protectedProcedure
    .input(
      z.object({
        regNo: z.string().trim().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (ctx.user.type !== "STUDENT" || ctx.user.studentRegNo !== input.regNo) {
          throw new AppError(401, "You can only access your own student data");
        }
        const student = await prisma.student.findUnique({
          where: {
            regNo: input.regNo,
          },
          select: {
            institution: true,
          },
        });

        if (!student) {
          throw new AppError(404, "Student does not exist");
        }

        return student.institution;
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  getCounsellorsByInstitution: protectedProcedure
    .input(
      z.object({
        institutionCode: z.string().trim().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (ctx.user.type !== "STUDENT") throw new AppError(401, "Student access required");
        const student = await prisma.student.findUnique({ where: { regNo: ctx.user.studentRegNo! } });
        if (!student || student.institutionCode !== input.institutionCode) throw new AppError(401, "Institution access denied");
        const institution = await prisma.institution.findUnique({
          where: {
            code: input.institutionCode,
          },
        });

        if (!institution) {
          throw new AppError(404, "Institution does not exist");
        }

        const counsellors = await prisma.counsellor.findMany({
          where: {
            institutions: {
              some: {
                institutionCode: input.institutionCode,
                status: "ACCEPTED",
              },
            },
          },
          select: {
            email: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        });

        return counsellors;
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Student books appointment
  createAppointment: protectedProcedure
    .input(
      z.object({
        studentRegNo: z.string(),
        counsellorEmail: z.string().email(),
        reason: z.string().min(5),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.user.type !== "STUDENT" || ctx.user.studentRegNo !== input.studentRegNo) throw new AppError(401, "You can only create your own appointments");
        const activeAppointment = await prisma.appointment.findFirst({
          where: {
            studentRegNo: input.studentRegNo,
            counsellorEmail: input.counsellorEmail,
            status: { in: ["PENDING", "APPROVED"] },
          },
        });

        if (activeAppointment) {
          throw new AppError(
            409,
            "You already have an active appointment with this counsellor. Complete it before booking another one.",
          );
        }

        return await prisma.appointment.create({
          data: {
            studentRegNo: input.studentRegNo,
            counsellorEmail: input.counsellorEmail,
            reason: input.reason,
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Student views their appointments
  myAppointments: protectedProcedure
    .input(
      z.object({
        studentRegNo: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.type !== "STUDENT" || ctx.user.studentRegNo !== input.studentRegNo) throw new AppError(401, "You can only access your own appointments");
      return prisma.appointment.findMany({
        where: {
          studentRegNo: input.studentRegNo,
        },
        include: {
          counsellor: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // Student cancels appointment
  cancelAppointment: protectedProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        studentRegNo: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.type !== "STUDENT" || ctx.user.studentRegNo !== input.studentRegNo) throw new AppError(401, "You can only cancel your own appointments");
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,
          studentRegNo: input.studentRegNo,
          status: "PENDING",
        },
      });

      if (!appointment) {
        throw new Error("Appointment cannot be cancelled");
      }

      return prisma.appointment.update({
        where: {
          id: input.appointmentId,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }),
});
