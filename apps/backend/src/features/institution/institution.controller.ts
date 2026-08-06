import { Request, Response, NextFunction } from "express";

import { createInstitutionService, getAvailableCounsellorsService, getPendingCounsellorsService, inviteCounsellorService, updateCounsellorInvitationService } from "./institution.service";

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

export async function inviteCounsellor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const institution = await inviteCounsellorService(req.body);

    res.status(201).json({
      success: true,
      message: "Institution created successfully.",
      data: institution,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPendingCounsellors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { institutionCode } = req.params;

    const counsellors =
      await getPendingCounsellorsService(institutionCode as string);

    res.status(200).json({
      success: true,
      message: "Pending counsellors fetched successfully.",
      data: counsellors,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAvailableCounsellorsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { institutionCode } = req.params;

    const counsellors =
      await getAvailableCounsellorsService(institutionCode as string);

    res.status(200).json({
      success: true,
      message: "Available counsellors fetched successfully.",
      data: counsellors,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCounsellorInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { institutionCode, counsellorEmail } = req.params;
    const { status } = req.body;

    const invitation = await updateCounsellorInvitationService(
      institutionCode as string,
      counsellorEmail as string,
      status
    );

    res.status(200).json({
      success: true,
      message:
        status === "ACCEPTED"
          ? "Counsellor invitation accepted successfully."
          : "Counsellor invitation rejected successfully.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}