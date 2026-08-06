import type { Request, Response, NextFunction } from "express";
import { createCounsellorSchema } from "./counsellor.schema";
import { createCounsellorService, getJoinedInstitutionsService, getPendingInvitationsService, leaveInstitutionService, updateInvitationStatusService } from "./counsellor.service";

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

export async function getPendingInvitations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Change to User Cookie 
    const { email } = req.body;

    const invitations =
      await getPendingInvitationsService(email);

    res.status(200).json({
      success: true,
      message: "Pending invitations fetched successfully.",
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
}
export async function getJoinedInstitutions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Change to User Cookie 
    const { email } = req.body;

    const institutions =
      await getJoinedInstitutionsService(email);

    res.status(200).json({
      success: true,
      message: "Joined institutions fetched successfully.",
      data: institutions,
    });
  } catch (error) {
    next(error);
  }
}

export async function leaveInstitutionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Change to User Cookie 
    const { email } = req.body;
    const { institutionCode } = req.params;

    await leaveInstitutionService(
      email,
      institutionCode as string
    );

    res.status(200).json({
      success: true,
      message: "Institution left successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Change to User Cookie 
    const { email } = req.body;
    const { institutionCode } = req.params;

    const invitation =
      await updateInvitationStatusService(
        email,
        institutionCode  as string,
        "ACCEPTED"
      );

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Change to User Cookie 
    const { email } = req.body;
    const { institutionCode } = req.params;

    const invitation =
      await updateInvitationStatusService(
        email,
        institutionCode as string,
        "REJECTED"
      );

    res.status(200).json({
      success: true,
      message: "Invitation rejected successfully.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
}