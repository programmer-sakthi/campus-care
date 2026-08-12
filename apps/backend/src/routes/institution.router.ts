import { prisma, Prisma, $Enums } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { appErrorToTRPC, publicProcedure, router } from "../trpc";

function normalizePrismaError(error: unknown): unknown {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const fields = Array.isArray(error.meta?.target) ? error.meta.target : [];

    if (fields.includes("code")) {
      return new AppError(409, "Institution code already exists.");
    }

    if (fields.includes("email")) {
      return new AppError(409, "Institution email already exists.");
    }

    return new AppError(409, "Duplicate value.");
  }

  return error;
}

export async function createInstitution(
  input: {
    code: string;
    email: string;
    name?: string;
  },
  db: Prisma.TransactionClient | typeof prisma = prisma,
) {
  return await db.institution.create({
    data: {
      code: input.code,
      email: input.email,
      name: input.name,
    },
  });
}

export const institutionRouter = router({
  create: publicProcedure
    .input(
      z.object({
        code: z.string().trim().min(1, "Institution code is required"),
        email: z.string().email(),
        name: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        return await createInstitution(input);
      } catch (error) {
        return appErrorToTRPC(normalizePrismaError(error));
      }
    }),

  inviteCounsellor: publicProcedure
    .input(
      z.object({
        code: z.string().trim().min(1, "Institution code is required"),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const existing = await prisma.institutionCounsellor.findUnique({
          where: {
            institutionCode_counsellorEmail: {
              institutionCode: input.code,
              counsellorEmail: input.email,
            },
          },
        });

        if (existing) {
          if (existing.status === "ACCEPTED") {
            throw new AppError(
              400,
              "Counsellor is already a member of this institution.",
            );
          }

          return await prisma.institutionCounsellor.update({
            where: {
              institutionCode_counsellorEmail: {
                institutionCode: input.code,
                counsellorEmail: input.email,
              },
            },
            data: {
              status: "PENDING",
              invitedAt: new Date(),
            },
          });
        }

        // Ensure the counsellor exists to avoid foreign key constraint errors
        await prisma.counsellor.upsert({
          where: { email: input.email },
          update: {},
          create: { email: input.email },
        });

        return await prisma.institutionCounsellor.create({
          data: {
            institutionCode: input.code,
            counsellorEmail: input.email,
            status: "PENDING",
          },
        });
      } catch (error) {
        return appErrorToTRPC(normalizePrismaError(error));
      }
    }),

  pendingCounsellors: publicProcedure
    .input(z.object({ institutionCode: z.string().trim().min(1) }))
    .query(async ({ input }) => {
      return prisma.institutionCounsellor.findMany({
        where: {
          institutionCode: input.institutionCode,
          status: $Enums.CounsellorInvitationStatus.PENDING,
        },
        include: {
          counsellor: true,
        },
        orderBy: {
          invitedAt: "desc",
        },
      });
    }),

  availableCounsellors: publicProcedure
    .input(z.object({ institutionCode: z.string().trim().min(1) }))
    .query(async ({ input }) => {
      return prisma.counsellor.findMany({
        where: {
          institutions: {
            some: {
              institutionCode: input.institutionCode,
              status: $Enums.CounsellorInvitationStatus.ACCEPTED,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    }),
});
