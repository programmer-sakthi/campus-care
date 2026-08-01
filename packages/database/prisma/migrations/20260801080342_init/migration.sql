-- CreateTable
CREATE TABLE "Institution" (
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Counsellor" (
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Counsellor_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "InstitutionCounsellor" (
    "institutionCode" TEXT NOT NULL,
    "counsellorEmail" TEXT NOT NULL,
    "noOfSessions" INTEGER DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionCounsellor_pkey" PRIMARY KEY ("institutionCode","counsellorEmail")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_email_key" ON "Institution"("email");

-- AddForeignKey
ALTER TABLE "InstitutionCounsellor" ADD CONSTRAINT "InstitutionCounsellor_institutionCode_fkey" FOREIGN KEY ("institutionCode") REFERENCES "Institution"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionCounsellor" ADD CONSTRAINT "InstitutionCounsellor_counsellorEmail_fkey" FOREIGN KEY ("counsellorEmail") REFERENCES "Counsellor"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
