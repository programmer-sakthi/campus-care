import { Prisma } from "@repo/database";

import { createInstitution, getAvailableCounsellors, getPendingCounsellors, inviteCounsellor } from "./institution.repository";
import type { CounsellorInvitationDto, CreateInstitutionDto } from "./institution.schema";
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

export async function inviteCounsellorService(
  data: CounsellorInvitationDto
) {
  try {
    return await inviteCounsellor(data);
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

export async function getPendingCounsellorsService(
  institutionCode: string
) {
  return await getPendingCounsellors(institutionCode);
}

export async function getAvailableCounsellorsService(
  institutionCode: string
) {
  return await getAvailableCounsellors(institutionCode);
}
