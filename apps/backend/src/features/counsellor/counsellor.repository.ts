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