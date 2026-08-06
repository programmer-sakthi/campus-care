import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { acceptInvitation, createCounsellor, getJoinedInstitutions, getPendingInvitations, leaveInstitutionController, rejectInvitation } from "./counsellor.controller";
import { userContextSchema } from "./counsellor.schema";

const router = Router();

router.post("/", createCounsellor);

router.get(
  "/invitations/pending",
  validate(userContextSchema),
  getPendingInvitations
);

router.get(
  "/institutions",
  validate(userContextSchema),
  getJoinedInstitutions
);

router.patch(
  "/institutions/:institutionCode/leave",
  validate(userContextSchema),
  leaveInstitutionController
);

router.patch(
  "/invitations/:institutionCode/accept",
  validate(userContextSchema),
  acceptInvitation
);

router.patch(
  "/invitations/:institutionCode/reject",
  validate(userContextSchema),
  rejectInvitation
);


export default router;