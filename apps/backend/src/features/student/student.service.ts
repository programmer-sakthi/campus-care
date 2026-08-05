import * as studentRepository from "./student.repository";
import { AppError } from "../../common/errors/AppError";

import type { CreateStudentInput } from "./student.types";


export const createStudent = async (
  data: CreateStudentInput
) => {

  const institution =
    await studentRepository.findInstitution(
      data.institutionCode
    );


  if (!institution) {
    throw new AppError(
      404,
      "Institution does not exist"
    );
  }



  const existingStudent =
    await studentRepository.findStudentByRegNo(
      data.regNo
    );


  if (existingStudent) {
    throw new AppError(
      409,
      "Student with this registration number already exists"
    );
  }



  return studentRepository.createStudent(data);

};