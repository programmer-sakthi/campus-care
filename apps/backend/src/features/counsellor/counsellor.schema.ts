import { z } from "zod";

export const createCounsellorSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).optional(),
});

export type CreateCounsellorDto = z.infer<typeof createCounsellorSchema>;