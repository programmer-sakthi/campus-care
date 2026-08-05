import type { Request, Response, NextFunction } from "express";

import * as studentService from "./student.service";


export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const student =
      await studentService.createStudent(
        req.body
      );


    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });


  } catch(error) {

    next(error);

  }

};