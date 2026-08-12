import { Prisma, prisma } from "@repo/database";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { hashPassword, verifyPassword } from "./password";
import { createToken } from "./jwt";
import { createStudent } from "../routes/student.router";
import { createCounsellor } from "../routes/counsellor.router";
import { createInstitution } from "../routes/institution.router";

export const authRouter = router({



    register:

        publicProcedure
            .input(
                z.object({

                    email: z.string().email(),

                    password: z.string().min(6),

                    type: z.enum([
                        "STUDENT",
                        "COUNSELLOR",
                        "INSTITUTION"
                    ]),


                    studentRegNo: z.string().optional(),

                    counsellorEmail: z.string().optional(),

                    institutionCode: z.string().optional(),
                    institutionName: z.string().optional(),
                    name: z.string().trim().optional()

                })
            )


            .mutation(async ({ input }) => {
                const passwordHash = await hashPassword(input.password);

                const user = await prisma.$transaction(async (tx) => {
                    const createData: Prisma.UserUncheckedCreateInput = {
                        email: input.email,
                        passwordHash,
                        type: input.type,
                    };

                    if (input.type === "STUDENT") {
                        const studentRegNo = input.studentRegNo?.trim();
                        const institutionCode = input.institutionCode?.trim();

                        if (!studentRegNo || !institutionCode) {
                            throw new Error(
                                "studentRegNo and institutionCode are required for STUDENT registration",
                            );
                        }

                        const student = await createStudent(
                            {
                                regNo: studentRegNo,
                                email: input.email,
                                institutionCode,
                                name: input.name,
                            },
                            tx,
                        );

                        createData.studentRegNo = student.regNo;

                        return await tx.user.create({ data: createData });
                    }

                    if (input.type === "COUNSELLOR") {
                        const counsellorEmail = input.counsellorEmail?.trim() || input.email;

                        await createCounsellor(
                            {
                                email: counsellorEmail,
                                name: input.name,
                            },
                            tx,
                        );

                        createData.counsellorEmail = counsellorEmail;

                        return await tx.user.create({ data: createData });
                    }

                    if (input.type === "INSTITUTION") {
                        const institutionCode = input.institutionCode?.trim();
                        const institutionName = input.institutionName?.trim();

                        if (!institutionCode) {
                            throw new Error(
                                "institutionCode is required for INSTITUTION registration",
                            );
                        }

                        await createInstitution(
                            {
                                code: institutionCode,
                                email: input.email,
                                name: institutionName,
                            },
                            tx,
                        );

                        createData.institutionCode = institutionCode;

                        return await tx.user.create({ data: createData });
                    }

                    throw new Error("Unsupported user type");
                });

                const token = createToken({
                    id: user.id,
                    email: user.email,
                    type: user.type,
                });

                return {
                    token,
                    user,
                };
            }),




    login:

        publicProcedure
            .input(
                z.object({

                    email: z.string().email(),

                    password: z.string()

                })
            )

            .mutation(async ({ input }) => {


                const user =
                    await prisma.user.findUnique({

                        where: {
                            email: input.email
                        }

                    });


                if (!user) {

                    throw new Error(
                        "Invalid credentials"
                    );

                }



                const valid =
                    await verifyPassword(
                        input.password,
                        user.passwordHash
                    );


                if (!valid) {

                    throw new Error(
                        "Invalid credentials"
                    );

                }



                const token = createToken({

                    id: user.id,

                    email: user.email,

                    type: user.type

                });



                return {

                    token,

                    user

                };


            })



});