import { Prisma } from "@repo/database";
import { prisma } from "@repo/database";
import logger from "../../config/logger";
import type { CreateInstitutionDto } from "./institution.schema";

export async function createInstitution(
  data: CreateInstitutionDto
) {
  try {
    return await prisma.institution.create({
      data: {
        code: data.code,
        email: data.email,
        name: data.name,
      },
    });
  } catch (error : any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(
        {
          code: error.code,
          message: error.message,
          meta: error.meta,
        },
        "Failed to create institution"
      );
    } else {
      logger.error({ err: error }, "Unexpected repository error");
    }

    throw error;
  }
}