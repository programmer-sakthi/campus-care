import { Router } from "express";

import institutionRoutes from "../features/institution";
import counsellorRoutes from "../features/counsellor";
import { studentRoutes } from "../features/student";

const router = Router();

router.use("/institutions", institutionRoutes);
router.use("/counsellors", counsellorRoutes);
router.use("/students",studentRoutes);

export default router;