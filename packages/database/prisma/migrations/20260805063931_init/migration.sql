-- CreateTable
CREATE TABLE "Student" (
    "regNo" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "institutionCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("regNo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_institutionCode_fkey" FOREIGN KEY ("institutionCode") REFERENCES "Institution"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
