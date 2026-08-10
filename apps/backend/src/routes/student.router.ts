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
});
