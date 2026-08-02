import { Router } from "express";
import { createCounsellor } from "./counsellor.controller";

const router = Router();

router.post("/", createCounsellor);

export default router;