-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MoodTime" AS ENUM ('MORNING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('VERY_BAD', 'BAD', 'NEUTRAL', 'GOOD', 'VERY_GOOD');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "counsellorEmail" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "rejectionReason" TEXT,
    "sessionNote" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckIn" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "note" TEXT,
    "mentalHealthScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "dailyCheckInId" TEXT NOT NULL,
    "time" "MoodTime" NOT NULL,
    "mood" "Mood" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckInQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" TEXT NOT NULL,
    "dailyCheckInId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyCheckIn_studentRegNo_date_idx" ON "DailyCheckIn"("studentRegNo", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckIn_studentRegNo_date_key" ON "DailyCheckIn"("studentRegNo", "date");

-- CreateIndex
CREATE INDEX "MoodEntry_dailyCheckInId_idx" ON "MoodEntry"("dailyCheckInId");

-- CreateIndex
CREATE UNIQUE INDEX "MoodEntry_dailyCheckInId_time_key" ON "MoodEntry"("dailyCheckInId", "time");

-- CreateIndex
CREATE INDEX "QuestionResponse_dailyCheckInId_idx" ON "QuestionResponse"("dailyCheckInId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionResponse_dailyCheckInId_questionId_key" ON "QuestionResponse"("dailyCheckInId", "questionId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentRegNo_fkey" FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_counsellorEmail_fkey" FOREIGN KEY ("counsellorEmail") REFERENCES "Counsellor"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCheckIn" ADD CONSTRAINT "DailyCheckIn_studentRegNo_fkey" FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_dailyCheckInId_fkey" FOREIGN KEY ("dailyCheckInId") REFERENCES "DailyCheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_dailyCheckInId_fkey" FOREIGN KEY ("dailyCheckInId") REFERENCES "DailyCheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CheckInQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
