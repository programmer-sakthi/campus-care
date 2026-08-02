import { Router } from "express";

import institutionRoutes from "../features/institution";
import counsellorRoutes from "../features/counsellor";

const router = Router();

router.use("/institutions", institutionRoutes);
router.use("/counsellors", counsellorRoutes);

export default router;