-- CreateEnum
CREATE TYPE "ChatbotRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "ChatbotMessage" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "role" "ChatbotRole" NOT NULL,
    "content" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatbotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatbotMessage_studentRegNo_createdAt_idx"
    ON "ChatbotMessage"("studentRegNo", "createdAt");

-- AddForeignKey
ALTER TABLE "ChatbotMessage"
    ADD CONSTRAINT "ChatbotMessage_studentRegNo_fkey"
    FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo")
    ON DELETE CASCADE ON UPDATE CASCADE;
