import { $Enums, prisma } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { analyseDailyCheckIn } from "../lib/mlService";
import { appErrorToTRPC, protectedProcedure, router } from "../trpc";

const moodSchema = z.object({
  time: z.enum(["morning", "evening", "night"]),
  mood: z.enum(["very_happy", "happy", "neutral", "sad", "very_sad"]),
});
const answersSchema = z.object({
  sleepHours: z.number().min(0).max(24).nullable(),
  happyMoment: z.string().trim().max(2000),
  stressfulMoment: z.string().trim().max(2000),
  waterIntake: z.enum(["yes", "no"]).nullable(),
  dailyReflection: z.string().trim().max(4000),
});
const moodToDatabase: Record<z.infer<typeof moodSchema>["mood"], $Enums.Mood> = {
  very_happy: $Enums.Mood.VERY_GOOD, happy: $Enums.Mood.GOOD, neutral: $Enums.Mood.NEUTRAL,
  sad: $Enums.Mood.BAD, very_sad: $Enums.Mood.VERY_BAD,
};
const moodValue: Record<$Enums.Mood, number> = {
  VERY_GOOD: 5, GOOD: 4, NEUTRAL: 3, BAD: 2, VERY_BAD: 1,
};

function requireStudent(user: { type: string; studentRegNo?: string | null }) {
  if (user.type !== "STUDENT" || !user.studentRegNo) throw new AppError(403, "Only students can use daily check-ins");
  return user.studentRegNo;
}
function today() { const date = new Date(); date.setHours(0, 0, 0, 0); return date; }
function category(score: number): "Excellent" | "Good" | "Needs Attention" { return score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Attention"; }
function getStreak(checkIns: { date: Date }[]) {
  const dates = [...new Set(checkIns.map((checkIn) => checkIn.date.toISOString().slice(0, 10)))].sort().reverse();
  let currentStreak = 0;
  let cursor = today();
  for (const date of dates) {
    if (date !== cursor.toISOString().slice(0, 10)) break;
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  let longestStreak = 0, run = 0, previous: Date | undefined;
  for (const item of [...checkIns].sort((a, b) => a.date.getTime() - b.date.getTime())) {
    if (previous && item.date.getTime() - previous.getTime() === 86_400_000) run += 1;
    else run = 1;
    longestStreak = Math.max(longestStreak, run);
    previous = item.date;
  }
  return { currentStreak, longestStreak, lastCheckInDate: dates[0] ? `${dates[0]}T00:00:00.000Z` : null };
}

export const dailyCheckInRouter = router({
  today: protectedProcedure.query(async ({ ctx }) => {
    try {
      const studentRegNo = requireStudent(ctx.user);
      const [checkIn, allCheckIns] = await Promise.all([
        prisma.dailyCheckIn.findUnique({ where: { studentRegNo_date: { studentRegNo, date: today() } }, include: { moods: true } }),
        prisma.dailyCheckIn.findMany({ where: { studentRegNo }, select: { date: true } }),
      ]);
      return { checkIn, streak: getStreak(allCheckIns) };
    } catch (error) { return appErrorToTRPC(error); }
  }),
  submit: protectedProcedure.input(z.object({ moods: z.array(moodSchema).min(1).max(3), answers: answersSchema })).mutation(async ({ input, ctx }) => {
    try {
      const studentRegNo = requireStudent(ctx.user);
      if (new Set(input.moods.map((m) => m.time)).size !== input.moods.length) throw new AppError(400, "Each mood time can only be submitted once");
      let analysis;
      try { analysis = await analyseDailyCheckIn({ studentId: studentRegNo, ...input }); }
      catch (error) {
        // Keep the client message safe, while retaining the downstream error
        // in the backend log for operators to diagnose quickly.
        console.error("Daily check-in analysis failed", error);
        throw new AppError(502, "Check-in analysis is unavailable right now. Please try again shortly.");
      }
      const score = Math.round(Math.max(0, Math.min(100, analysis.score)));
      const result = await prisma.dailyCheckIn.upsert({
        where: { studentRegNo_date: { studentRegNo, date: today() } },
        create: { studentRegNo, date: today(), note: input.answers.dailyReflection || null, answers: input.answers, insights: analysis.insights, mentalHealthScore: score, moods: { create: input.moods.map((m) => ({ time: m.time.toUpperCase() as $Enums.MoodTime, mood: moodToDatabase[m.mood] })) } },
        update: { note: input.answers.dailyReflection || null, answers: input.answers, insights: analysis.insights, mentalHealthScore: score, moods: { deleteMany: {}, create: input.moods.map((m) => ({ time: m.time.toUpperCase() as $Enums.MoodTime, mood: moodToDatabase[m.mood] })) } },
        include: { moods: true },
      });
      return { checkIn: result, result: { score, category: category(score), insights: analysis.insights } };
    } catch (error) { return appErrorToTRPC(error); }
  }),
  weeklyReview: protectedProcedure.input(z.object({ offset: z.number().int().min(0).max(2).default(0) })).query(async ({ input, ctx }) => {
    try {
      const studentRegNo = requireStudent(ctx.user);
      const end = today(); end.setDate(end.getDate() - input.offset * 7 + 1);
      const start = new Date(end); start.setDate(start.getDate() - 7);
      const checkIns = await prisma.dailyCheckIn.findMany({ where: { studentRegNo, date: { gte: start, lt: end } }, include: { moods: true }, orderBy: { date: "asc" } });
      const scores = checkIns.flatMap((c) => c.mentalHealthScore === null ? [] : [c.mentalHealthScore]);
      const counts = new Map<string, number>();
      checkIns.flatMap((c) => c.moods).forEach((m) => counts.set(m.mood, (counts.get(m.mood) ?? 0) + 1));
      return { weekLabel: input.offset === 0 ? "Current Week" : input.offset === 1 ? "Previous Week" : "2 Weeks Ago", averageMood: checkIns.flatMap((c) => c.moods).reduce((sum, m) => sum + moodValue[m.mood], 0) / Math.max(1, checkIns.flatMap((c) => c.moods).length), averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, commonEmotions: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([mood]) => mood.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())), totalCheckIns: checkIns.length };
    } catch (error) { return appErrorToTRPC(error); }
  }),
});
