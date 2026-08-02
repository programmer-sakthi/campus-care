import { Request, Response, NextFunction } from "express";

import { createInstitutionService } from "./institution.service";

export async function createInstitution(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const institution = await createInstitutionService(req.body);

    res.status(201).json({
      success: true,
      message: "Institution created successfully.",
      data: institution,
    });
  } catch (error) {
    next(error);
  }
}