import { z } from "zod";

export const createInstitutionSchema = z.object({
  code: z.string().trim().min(1, "Institution code is required"),

  email: z.email(),

  name: z.string().trim().optional(),
});

export type CreateInstitutionDto = z.infer<
  typeof createInstitutionSchema
>;

export const counsellorInvitationSchema = z.object({
  code: z.string().trim().min(1, "Institution code is required"),
  email: z.email(),
});

export type CounsellorInvitationDto = z.infer<
  typeof counsellorInvitationSchema
>;
