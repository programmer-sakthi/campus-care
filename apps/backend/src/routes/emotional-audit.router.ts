import { $Enums, prisma } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { analyseEmotionalAudit } from "../lib/mlService";
import { LIKERT_IDS, SAFETY_IDS } from "../lib/emotionalAuditQuestions";
import { overallCategory, overallScore, scoreDomains } from "../lib/emotionalAuditScoring";
import { appErrorToTRPC, protectedProcedure, router } from "../trpc";

// Students may only retake the audit every 10 days. Tracked in hours so the
// frontend can show a live countdown rather than just a date.
const COOLDOWN_HOURS = 240;
const MS_PER_HOUR = 60 * 60 * 1000;

const likertAnswersSchema = z
  .record(z.string(), z.number().int().min(0).max(4))
  .refine(
    (answers) => LIKERT_IDS.every((id) => id in answers),
    { message: "All Section A-F questions must be answered" }
  );

const safetyAnswersSchema = z
  .record(z.string(), z.boolean())
  .refine(
    (answers) => SAFETY_IDS.every((id) => id in answers),
    { message: "All Section G (safety) questions must be answered" }
  );

const categoryToDatabase: Record<"LOW" | "MODERATE" | "HIGH", $Enums.ConcernLevel> = {
  LOW: $Enums.ConcernLevel.LOW,
  MODERATE: $Enums.ConcernLevel.MODERATE,
  HIGH: $Enums.ConcernLevel.HIGH,
};

function requireStudent(user: { type: string; studentRegNo?: string | null }) {
  if (user.type !== "STUDENT" || !user.studentRegNo) {
    throw new AppError(403, "Only students can take the Emotional Audit");
  }
  return user.studentRegNo;
}

function cooldownState(lastSubmittedAt: Date | null) {
  if (!lastSubmittedAt) {
    return { eligible: true, lastSubmittedAt: null, nextAvailableAt: null, hoursRemaining: 0 };
  }
  const nextAvailableAt = new Date(lastSubmittedAt.getTime() + COOLDOWN_HOURS * MS_PER_HOUR);
  const msRemaining = nextAvailableAt.getTime() - Date.now();
  if (msRemaining <= 0) {
    return { eligible: true, lastSubmittedAt: lastSubmittedAt.toISOString(), nextAvailableAt: null, hoursRemaining: 0 };
  }
  return {
    eligible: false,
    lastSubmittedAt: lastSubmittedAt.toISOString(),
    nextAvailableAt: nextAvailableAt.toISOString(),
    hoursRemaining: Math.ceil(msRemaining / MS_PER_HOUR),
  };
}

export const emotionalAuditRouter = router({
  eligibility: protectedProcedure.query(async ({ ctx }) => {
    try {
      const studentRegNo = requireStudent(ctx.user);
      const latest = await prisma.emotionalAudit.findFirst({
        where: { studentRegNo },
        orderBy: { submittedAt: "desc" },
        select: { submittedAt: true },
      });
      return cooldownState(latest?.submittedAt ?? null);
    } catch (error) {
      return appErrorToTRPC(error);
    }
  }),

  submit: protectedProcedure
    .input(z.object({ likertAnswers: likertAnswersSchema, safetyAnswers: safetyAnswersSchema }))
    .mutation(async ({ input, ctx }) => {
      try {
        const studentRegNo = requireStudent(ctx.user);

        const latest = await prisma.emotionalAudit.findFirst({
          where: { studentRegNo },
          orderBy: { submittedAt: "desc" },
          select: { submittedAt: true },
        });
        const state = cooldownState(latest?.submittedAt ?? null);
        if (!state.eligible) {
          throw new AppError(409, "You can retake the Emotional Audit once every 10 days");
        }

        // Section G is the safety net: a single "yes" here is a crisis
        // signal and is handled independently of scoring or the LLM, so it
        // can never be diluted or delayed by either.
        const safetyTriggered = SAFETY_IDS.some((id) => input.safetyAnswers[id] === true);

        const domainScores = scoreDomains(input.likertAnswers);
        const score = overallScore(domainScores);
        const category = overallCategory(score);

        let insights: string[] = [];
        let summary = "";
        if (!safetyTriggered) {
          try {
            const analysis = await analyseEmotionalAudit({
              studentId: studentRegNo,
              domainScores: domainScores.map((d) => ({ ...d, level: d.level.toLowerCase() as "low" | "moderate" | "high" })),
              overallScore: score,
              overallCategory: category.toLowerCase() as "low" | "moderate" | "high",
            });
            insights = analysis.recommendations;
            summary = analysis.summary;
          } catch (error) {
            // The domain scores are already computed deterministically and
            // the 10-day cooldown should still start even if ml-service is
            // briefly unavailable — a student shouldn't be blocked from
            // recording an audit because the insight-writing step failed.
            console.error("Emotional audit analysis failed", error);
            insights = [
              "We couldn't generate personalised suggestions this time, but your results have been saved.",
            ];
          }
        }

        const audit = await prisma.emotionalAudit.create({
          data: {
            studentRegNo,
            answers: { ...input.likertAnswers, ...input.safetyAnswers },
            domainScores: Object.fromEntries(domainScores.map((d) => [d.domain, d.score])),
            overallScore: score,
            overallCategory: categoryToDatabase[category],
            insights,
            safetyTriggered,
          },
        });

        return {
          audit,
          result: {
            overallScore: score,
            overallCategory: category,
            domainScores,
            insights,
            summary,
            safetyTriggered,
          },
        };
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  history: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(20).default(5) }))
    .query(async ({ input, ctx }) => {
      try {
        const studentRegNo = requireStudent(ctx.user);
        return prisma.emotionalAudit.findMany({
          where: { studentRegNo },
          orderBy: { submittedAt: "desc" },
          take: input.limit,
          select: {
            id: true,
            submittedAt: true,
            overallScore: true,
            overallCategory: true,
            safetyTriggered: true,
          },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),
});
