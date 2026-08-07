import { counsellorRouter } from "./routes/counsellor.router";
import { institutionRouter } from "./routes/institution.router";
import { studentRouter } from "./routes/student.router";
import { router } from "./trpc";

export const appRouter = router({
  institution: institutionRouter,
  counsellor: counsellorRouter,
  student: studentRouter,
});

export type AppRouter = typeof appRouter;
