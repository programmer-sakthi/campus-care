-- CreateTable
CREATE TABLE "ChatbotChat" (
    "id" TEXT NOT NULL,
    "studentRegNo" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatbotChat_pkey" PRIMARY KEY ("id")
);

-- Preserve existing one-thread histories in a single legacy chat per student.
INSERT INTO "ChatbotChat" ("id", "studentRegNo", "title", "createdAt", "updatedAt")
SELECT md5("studentRegNo" || ':previous-chat'), "studentRegNo", 'Previous chat', MIN("createdAt"), MAX("createdAt")
FROM "ChatbotMessage"
GROUP BY "studentRegNo";

-- AlterTable
ALTER TABLE "ChatbotMessage" ADD COLUMN "chatId" TEXT;
UPDATE "ChatbotMessage" SET "chatId" = md5("studentRegNo" || ':previous-chat');
ALTER TABLE "ChatbotMessage" ALTER COLUMN "chatId" SET NOT NULL;
ALTER TABLE "ChatbotMessage" DROP CONSTRAINT "ChatbotMessage_studentRegNo_fkey";
ALTER TABLE "ChatbotMessage" DROP COLUMN "studentRegNo";

-- CreateIndex
CREATE INDEX "ChatbotChat_studentRegNo_updatedAt_idx" ON "ChatbotChat"("studentRegNo", "updatedAt");
CREATE INDEX "ChatbotMessage_chatId_createdAt_idx" ON "ChatbotMessage"("chatId", "createdAt");

-- AddForeignKey
ALTER TABLE "ChatbotChat" ADD CONSTRAINT "ChatbotChat_studentRegNo_fkey"
    FOREIGN KEY ("studentRegNo") REFERENCES "Student"("regNo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatbotMessage" ADD CONSTRAINT "ChatbotMessage_chatId_fkey"
    FOREIGN KEY ("chatId") REFERENCES "ChatbotChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
