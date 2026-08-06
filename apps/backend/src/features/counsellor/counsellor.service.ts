import { prisma, Prisma } from "@repo/database";
import type { CreateCounsellorDto } from "./counsellor.schema";
import { createCounsellor, getJoinedInstitutions, getPendingInvitations, leaveInstitution, updateInvitationStatus } from "./counsellor.repository";
import { AppError } from "../../common/errors/AppError";

export async function createCounsellorService(
  data: CreateCounsellorDto
) {
  try {
    return await createCounsellor(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("A counsellor with this email already exists.");
    }

    throw error;
  }
}

export async function getPendingInvitationsService(
  counsellorEmail: string
) {
  return getPendingInvitations(counsellorEmail);
}

export async function getJoinedInstitutionsService(
  counsellorEmail: string
) {
  return getJoinedInstitutions(counsellorEmail);
}

export async function leaveInstitutionService(
  counsellorEmail: string,
  institutionCode: string
) {
  const membership =
    await prisma.institutionCounsellor.findUnique({
      where: {
        institutionCode_counsellorEmail: {
          institutionCode,
          counsellorEmail,
        },
      },
    });

  if (!membership) {
    throw new AppError(
      404,
      "Institution membership not found."
    );
  }

  if (membership.status !== "ACCEPTED") {
    throw new AppError(
      400,
      "Counsellor is not currently a member of this institution."
    );
  }

  return leaveInstitution(
    counsellorEmail,
    institutionCode
  );
}

export async function updateInvitationStatusService(
  counsellorEmail: string,
  institutionCode: string,
  status: "ACCEPTED" | "REJECTED"
) {
  const invitation =
    await prisma.institutionCounsellor.findUnique({
      where: {
        institutionCode_counsellorEmail: {
          institutionCode,
          counsellorEmail,
        },
      },
    });

  if (!invitation) {
    throw new AppError(
      404,
      "Invitation not found."
    );
  }

  if (invitation.status !== "PENDING") {
    throw new AppError(
      400,
      "Only pending invitations can be accepted or rejected."
    );
  }

  return updateInvitationStatus(
    counsellorEmail,
    institutionCode,
    status
  );
}