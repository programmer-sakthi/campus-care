import { prisma } from "@repo/database";

import type { CreateStudentInput } from "./student.types";


export const createStudent = async (
  data: CreateStudentInput
) => {

  return prisma.student.create({
    data,
  });

};


export const findStudentByRegNo = async (
  regNo: string
) => {

  return prisma.student.findUnique({
    where: {
      regNo,
    },
  });

};


export const findInstitution = async (
  code: string
) => {

  return prisma.institution.findUnique({
    where: {
      code,
    },
  });

};