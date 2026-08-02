import { Prisma } from "@repo/database";

import { createInstitution } from "./institution.repository";
import type { CreateInstitutionDto } from "./institution.schema";
import { AppError } from "../../common/errors/AppError";

function isPrismaClientKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export async function createInstitutionService(
  data: CreateInstitutionDto
) {
  try {
    return await createInstitution(data);
  } catch (error) {
    if (
      isPrismaClientKnownRequestError(error) &&
      error.code === "P2002"
    ) {
      const fields = Array.isArray(error.meta?.target)
        ? error.meta.target
        : [];

      if (fields.includes("code")) {
        throw new AppError(
          409,
          "Institution code already exists."
        );
      }

      if (fields.includes("email")) {
        throw new AppError(
          409,
          "Institution email already exists."
        );
      }

      throw new AppError(
        409,
        "Duplicate value."
      );
    }

    throw error;
  }
}