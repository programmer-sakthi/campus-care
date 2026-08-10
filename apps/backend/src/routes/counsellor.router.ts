import { Prisma, prisma } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { appErrorToTRPC, publicProcedure, router } from "../trpc";

function normalizeCounsellorError(error: unknown): unknown {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return new AppError(409, "A counsellor with this email already exists.");
  }

  return error;
}

export const counsellorRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().trim().min(1).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await prisma.counsellor.create({
          data: {
            email: input.email,
            name: input.name,
          },
        });
      } catch (error) {
        return appErrorToTRPC(normalizeCounsellorError(error));
      }
    }),

  pendingInvitations: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.institutionCounsellor.findMany({
        where: {
          counsellorEmail: input.email,
          status: "PENDING",
        },
        include: {
          institution: true,
        },
        orderBy: {
          invitedAt: "desc",
        },
      });
    }),

  joinedInstitutions: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.institutionCounsellor.findMany({
        where: {
          counsellorEmail: input.email,
          status: "ACCEPTED",
        },
        include: {
          institution: true,
        },
        orderBy: {
          joinedAt: "desc",
        },
      });
    }),

  leaveInstitution: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        institutionCode: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const membership = await prisma.institutionCounsellor.findUnique({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
        });

        if (!membership) {
          throw new AppError(404, "Institution membership not found.");
        }

        if (membership.status !== "ACCEPTED") {
          throw new AppError(
            400,
            "Counsellor is not currently a member of this institution.",
          );
        }

        return prisma.institutionCounsellor.update({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
          data: {
            status: "LEFT",
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  acceptInvitation: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        institutionCode: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const invitation = await prisma.institutionCounsellor.findUnique({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
        });

        if (!invitation) {
          throw new AppError(404, "Invitation not found.");
        }

        if (invitation.status !== "PENDING") {
          throw new AppError(
            400,
            "Only pending invitations can be accepted or rejected.",
          );
        }

        return prisma.institutionCounsellor.update({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
          data: {
            status: "ACCEPTED",
            joinedAt: new Date(),
          },
          include: {
            institution: true,
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  rejectInvitation: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        institutionCode: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const invitation = await prisma.institutionCounsellor.findUnique({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
        });

        if (!invitation) {
          throw new AppError(404, "Invitation not found.");
        }

        if (invitation.status !== "PENDING") {
          throw new AppError(
            400,
            "Only pending invitations can be accepted or rejected.",
          );
        }

        return prisma.institutionCounsellor.update({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.institutionCode,
              counsellorEmail: input.email,
            },
          },
          data: {
            status: "REJECTED",
            joinedAt: null,
          },
          include: {
            institution: true,
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Counsellor sees pending requests
  appointmentRequests: publicProcedure
    .input(
      z.object({
        counsellorEmail: z.string().email(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.appointment.findMany({
        where: {
          counsellorEmail: input.counsellorEmail,
          status: "PENDING",
        },
        include: {
          student: true,
        },
        orderBy: {
          requestedAt: "asc",
        },
      });
    }),

  // Counsellor approves and schedules
  approveAppointment: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),

        counsellorEmail: z.string().email(),

        scheduledAt: z.date(),

        durationMinutes: z.number().min(15).max(120).default(30),
      }),
    )
    .mutation(async ({ input }) => {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,
          counsellorEmail: input.counsellorEmail,
          status: "PENDING",
        },
      });

      if (!appointment) {
        throw new Error("Appointment request not found");
      }

      return prisma.appointment.update({
        where: {
          id: input.appointmentId,
        },

        data: {
          status: "APPROVED",

          scheduledAt: input.scheduledAt,

          durationMinutes: input.durationMinutes,

          approvedAt: new Date(),
        },
      });
    }),

  // Counsellor rejects appointment
  rejectAppointment: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),

        counsellorEmail: z.string().email(),

        rejectionReason: z.string().min(5).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,
          counsellorEmail: input.counsellorEmail,
          status: "PENDING",
        },
      });

      if (!appointment) {
        throw new Error("Appointment request not found");
      }

      return prisma.appointment.update({
        where: {
          id: input.appointmentId,
        },

        data: {
          status: "REJECTED",

          rejectionReason: input.rejectionReason,
        },
      });
    }),

  // Counsellor views approved appointments
  scheduledAppointments: publicProcedure
    .input(
      z.object({
        counsellorEmail: z.string().email(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.appointment.findMany({
        where: {
          counsellorEmail: input.counsellorEmail,

          status: "APPROVED",
        },

        include: {
          student: true,
        },

        orderBy: {
          scheduledAt: "asc",
        },
      });
    }),

  // Complete session
  completeAppointment: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),

        counsellorEmail: z.string().email(),

        sessionNote: z.string().min(5),
      }),
    )
    .mutation(async ({ input }) => {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: input.appointmentId,

          counsellorEmail: input.counsellorEmail,

          status: "APPROVED",
        },
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      return prisma.appointment.update({
        where: {
          id: input.appointmentId,
        },

        data: {
          status: "COMPLETED",

          sessionNote: input.sessionNote,

          completedAt: new Date(),
        },
      });
    }),
});
