import { authRouter } from "./auth/auth.router";
import { chatRouter } from "./routes/chat.router";
import { chatbotRouter } from "./routes/chatbot.router";
import { counsellorRouter } from "./routes/counsellor.router";
import { institutionRouter } from "./routes/institution.router";
import { studentRouter } from "./routes/student.router";
import { dailyCheckInRouter } from "./routes/daily-checkin.router";
import { router } from "./trpc";

export const appRouter = router({
  institution: institutionRouter,
  counsellor: counsellorRouter,
  student: studentRouter,
  auth: authRouter,
  chat: chatRouter,
  chatbot: chatbotRouter,
  dailyCheckIn: dailyCheckInRouter,
});

export type AppRouter = typeof appRouter;
