import { CounsellorInvitationStatus, Prisma } from "@repo/database";
import { prisma } from "@repo/database";
import logger from "../../config/logger";
import type { CounsellorInvitationDto, CreateInstitutionDto } from "./institution.schema";


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

export async function inviteCounsellor(
  data: CounsellorInvitationDto
) {
  try {
    const { code, email } = data;

    const invitation = await prisma.institutionCounsellor.create({
      data: {
        institutionCode: code,
        counsellorEmail: email,
        status: "PENDING",
      },
    });

    return invitation;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(
        {
          code: error.code,
          message: error.message,
          meta: error.meta,
        },
        "Failed to invite counsellor"
      );
    } else {
      logger.error({ err: error }, "Unexpected repository error");
    }

    throw error;
  }
}


export async function getPendingCounsellors(
  institutionCode: string
) {
  return prisma.institutionCounsellor.findMany({
    where: {
      institutionCode,
      status: CounsellorInvitationStatus.PENDING,
    },
    include: {
      counsellor: true,
    },
    orderBy: {
      invitedAt: "desc",
    },
  });
}

export async function getAvailableCounsellors(
  institutionCode: string
) {
  return prisma.counsellor.findMany({
    where: {
      institutions: {
        none: {
          institutionCode,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
