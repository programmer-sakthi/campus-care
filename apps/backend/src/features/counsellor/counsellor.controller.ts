import type { Request, Response, NextFunction } from "express";
import { createCounsellorSchema } from "./counsellor.schema";
import { createCounsellorService } from "./counsellor.service";

export async function createCounsellor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createCounsellorSchema.parse(req.body);

    const counsellor = await createCounsellorService(data);

    res.status(201).json({
      success: true,
      data: counsellor,
    });
  } catch (error) {
    next(error);
  }
}