import { Prisma } from "@repo/database";
import type { CreateCounsellorDto } from "./counsellor.schema";
import { createCounsellor } from "./counsellor.repository";

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