import { z } from "zod";

export const createStudentSchema = z.object({
  regNo: z.string().min(1),
  name: z.string().optional(),
  email: z.string().email().optional(),
  institutionCode: z.string().min(1),
});