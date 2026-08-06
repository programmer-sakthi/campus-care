/*
  Warnings:

  - Made the column `noOfSessions` on table `InstitutionCounsellor` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CounsellorInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "InstitutionCounsellor" ADD COLUMN     "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "CounsellorInvitationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "noOfSessions" SET NOT NULL,
ALTER COLUMN "joinedAt" DROP NOT NULL,
ALTER COLUMN "joinedAt" DROP DEFAULT;
