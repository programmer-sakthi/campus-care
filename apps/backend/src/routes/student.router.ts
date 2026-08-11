import { prisma } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { appErrorToTRPC, publicProcedure, router } from "../trpc";

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
        const institution = await prisma.institution.findUnique({
          where: {
            code: input.institutionCode,
          },
        });

        if (!institution) {
          throw new AppError(404, "Institution does not exist");
        }

        const existingStudent = await prisma.student.findUnique({
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

        return prisma.student.create({
          data: {
            regNo: input.regNo,
            name: input.name,
            email: input.email,
            institutionCode: input.institutionCode,
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  getInstitutionByRegNo: publicProcedure
    .input(
      z.object({
        regNo: z.string().trim().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
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

  getCounsellorsByInstitution: publicProcedure
    .input(
      z.object({
        institutionCode: z.string().trim().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
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
  createAppointment: publicProcedure
    .input(
      z.object({
        studentRegNo: z.string(),
        counsellorEmail: z.string().email(),
        reason: z.string().min(5),
      }),
    )
    .mutation(async ({ input }) => {
      try {
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
  myAppointments: publicProcedure
    .input(
      z.object({
        studentRegNo: z.string(),
      }),
    )
    .query(async ({ input }) => {
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
  cancelAppointment: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        studentRegNo: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
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
