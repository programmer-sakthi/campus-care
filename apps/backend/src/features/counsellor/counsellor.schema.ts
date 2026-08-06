import { z } from "zod";

export const createCounsellorSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).optional(),
});

export type CreateCounsellorDto = z.infer<typeof createCounsellorSchema>;

export const userContextSchema = z.object({
  email: z.email(),
});

export type ListPendingDto = z.infer<typeof userContextSchema>;
