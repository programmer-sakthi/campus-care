import { Router } from "express";

import { createInstitution } from "./institution.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { createInstitutionSchema } from "./institution.schema";

const router = Router();

router.post(
  "/",
  validate(createInstitutionSchema),
  createInstitution
);

export default router;