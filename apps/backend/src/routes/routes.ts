import { Router } from "express";

import institutionRoutes from "../features/institution";

const router = Router();

router.use("/institutions", institutionRoutes);

export default router;