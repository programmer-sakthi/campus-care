import { prisma } from "@repo/database";
import type { CreateCounsellorDto } from "./counsellor.schema";

export async function createCounsellor(
  data: CreateCounsellorDto
) {
  return prisma.counsellor.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
}

export async function getPendingInvitations(
  counsellorEmail: string
) {
  return prisma.institutionCounsellor.findMany({
    where: {
      counsellorEmail,
      status: "PENDING",
    },
    include: {
      institution: true,
    },
    orderBy: {
      invitedAt: "desc",
    },
  });
}

export async function getJoinedInstitutions(
  counsellorEmail: string
) {
  return prisma.institutionCounsellor.findMany({
    where: {
      counsellorEmail,
      status: "ACCEPTED",
    },
    include: {
      institution: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  });
}

export async function leaveInstitution(
  counsellorEmail: string,
  institutionCode: string
) {
  return prisma.institutionCounsellor.update({
    where: {
      institutionCode_counsellorEmail: {
        institutionCode,
        counsellorEmail,
      },
    },
    data: {
      status: "LEFT",
    },
  });
}

export async function updateInvitationStatus(
  counsellorEmail: string,
  institutionCode: string,
  status: "ACCEPTED" | "REJECTED"
) {
  return prisma.institutionCounsellor.update({
    where: {
      institutionCode_counsellorEmail: {
        institutionCode,
        counsellorEmail,
      },
    },
    data: {
      status,
      joinedAt: status === "ACCEPTED" ? new Date() : null,
    },
    include: {
      institution: true,
    },
  });
}