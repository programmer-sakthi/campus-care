// Deterministic scoring for the Emotional Audit. Kept separate from the
// router so it's easy to unit test in isolation. Never trust a score
// computed on the client — this is the only place scores are produced.

import {
  DOMAIN_IDS,
  DOMAIN_LABELS,
  LIKERT_QUESTIONS,
  type DomainId,
} from "./emotionalAuditQuestions";

export type ConcernLevel = "LOW" | "MODERATE" | "HIGH";

export type DomainScore = {
  domain: DomainId;
  label: string;
  score: number; // 0-100, higher = more concern
  level: ConcernLevel;
};

function levelForScore(score: number): ConcernLevel {
  if (score >= 65) return "HIGH";
  if (score >= 35) return "MODERATE";
  return "LOW";
}

/**
 * @param likertAnswers Map of question id -> raw answer (0-4).
 */
export function scoreDomains(likertAnswers: Record<string, number>): DomainScore[] {
  const byDomain = new Map<DomainId, number[]>();
  for (const domain of DOMAIN_IDS) byDomain.set(domain, []);

  for (const question of LIKERT_QUESTIONS) {
    const raw = likertAnswers[question.id];
    if (raw === undefined) continue;
    // Normalise to a 0-100 concern contribution, inverting positively-worded
    // questions (e.g. "how confident are you") so higher always == worse.
    const concern = question.polarity === "positive" ? (4 - raw) * 25 : raw * 25;
    byDomain.get(question.domain)!.push(concern);
  }

  return DOMAIN_IDS.map((domain) => {
    const values = byDomain.get(domain)!;
    const score = values.length
      ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      : 0;
    return { domain, label: DOMAIN_LABELS[domain], score, level: levelForScore(score) };
  });
}

export function overallScore(domainScores: DomainScore[]): number {
  if (!domainScores.length) return 0;
  return Math.round(domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length);
}

export function overallCategory(score: number): ConcernLevel {
  return levelForScore(score);
}
