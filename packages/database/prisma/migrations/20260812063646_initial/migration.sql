-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'COUNSELLOR', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "MessageSenderType" AS ENUM ('STUDENT', 'COUNSELLOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "studentRegNo" TEXT,
    "counsellorEmail" TEXT,
    "institutionCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "counsellorEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderType" "MessageSenderType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentRegNo_key" ON "User"("studentRegNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_counsellorEmail_key" ON "User"("counsellorEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_institutionCode_key" ON "User"("institutionCode");

-- CreateIndex
CREATE INDEX "Conversation_studentRegNo_idx" ON "Conversation"("studentRegNo");

-- CreateIndex
CREATE INDEX "Conversation_counsellorEmail_idx" ON "Conversation"("counsellorEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_studentRegNo_counsellorEmail_key" ON "Conversation"("studentRegNo", "counsellorEmail");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentRegNo_fkey" FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_counsellorEmail_fkey" FOREIGN KEY ("counsellorEmail") REFERENCES "Counsellor"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institutionCode_fkey" FOREIGN KEY ("institutionCode") REFERENCES "Institution"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_studentRegNo_fkey" FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_counsellorEmail_fkey" FOREIGN KEY ("counsellorEmail") REFERENCES "Counsellor"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
