import { Router } from "express";

import { createInstitution, getAvailableCounsellorsController, getPendingCounsellors, inviteCounsellor, updateCounsellorInvitation } from "./institution.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { counsellorInvitationSchema, createInstitutionSchema } from "./institution.schema";

const router = Router();

router.post(
  "/",
  validate(createInstitutionSchema),
  createInstitution
);

router.post(
  "/counsellor/add",
  validate(counsellorInvitationSchema),
  inviteCounsellor
);

router.get(
  "/:institutionCode/counsellor/pending",
  getPendingCounsellors
);

router.get(
  "/:institutionCode/counsellor/available",
  getAvailableCounsellorsController
);

export default router;