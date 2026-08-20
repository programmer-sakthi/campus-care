-- CreateEnum
CREATE TYPE "ConcernLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateTable
CREATE TABLE "EmotionalAudit" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "domainScores" JSONB NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "overallCategory" "ConcernLevel" NOT NULL,
    "insights" JSONB NOT NULL,
    "safetyTriggered" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmotionalAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmotionalAudit_studentRegNo_submittedAt_idx"
    ON "EmotionalAudit"("studentRegNo", "submittedAt");

-- AddForeignKey
ALTER TABLE "EmotionalAudit"
    ADD CONSTRAINT "EmotionalAudit_studentRegNo_fkey"
    FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo")
    ON DELETE CASCADE ON UPDATE CASCADE;
