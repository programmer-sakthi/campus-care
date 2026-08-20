// types/emotionalAudit.types.ts

export type DomainId =
  | "mood"
  | "anxiety"
  | "stress"
  | "sleep"
  | "academic"
  | "social"
  | "coping";

export type ConcernLevel = "LOW" | "MODERATE" | "HIGH";

export type ScaleType = "frequency" | "confidence" | "support";

export interface LikertQuestion {
  id: string;
  domain: DomainId;
  text: string;
  polarity: "negative" | "positive"; // negative: higher raw answer = more concern
  scaleType: ScaleType;
}

export interface SafetyQuestion {
  id: string;
  text: string;
}

/** A single question in flat, presentation order (q1..q29) for the
 * one-question-per-screen flow. `kind` discriminates which answer control
 * and answer map applies. */
export type AuditQuestion =
  | (LikertQuestion & { kind: "likert" })
  | (SafetyQuestion & { kind: "safety" });

/** raw 0-4 answers for Section A-F, keyed by question id */
export type LikertAnswers = Record<string, number>;

/** yes/no answers for Section G, keyed by question id */
export type SafetyAnswers = Record<string, boolean>;

export interface DomainScore {
  domain: DomainId;
  label: string;
  score: number; // 0-100, higher = more concern
  level: ConcernLevel;
}

export interface AuditResult {
  overallScore: number;
  overallCategory: ConcernLevel;
  domainScores: DomainScore[];
  insights: string[];
  summary: string;
  safetyTriggered: boolean;
}

export interface EligibilityState {
  eligible: boolean;
  lastSubmittedAt: string | null;
  nextAvailableAt: string | null;
  hoursRemaining: number;
}
