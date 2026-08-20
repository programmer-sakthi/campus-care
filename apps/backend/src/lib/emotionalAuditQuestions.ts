// Canonical question bank for the Emotional Audit — the source of truth for
// scoring. The student app's `constants/questions.ts` mirrors the ids,
// order, and text of this file for rendering; if you change a question here,
// update it there too.
//
// Domain scores are 0-100 "concern" scores: higher always means more
// concern, regardless of how the underlying question was worded. Questions
// where a *high* raw answer is actually a good sign (e.g. confidence in
// coping) are marked `polarity: "positive"` and inverted before scoring.

export const DOMAIN_IDS = [
  "mood",
  "anxiety",
  "stress",
  "sleep",
  "academic",
  "social",
  "coping",
] as const;
export type DomainId = (typeof DOMAIN_IDS)[number];

export const DOMAIN_LABELS: Record<DomainId, string> = {
  mood: "Mood",
  anxiety: "Anxiety",
  stress: "Stress",
  sleep: "Sleep",
  academic: "Academic Functioning",
  social: "Social & Emotional Well-being",
  coping: "Coping",
};

export type LikertQuestion = {
  id: string;
  domain: DomainId;
  polarity: "negative" | "positive"; // negative: higher raw = more concern
};

export type SafetyQuestion = {
  id: string;
};

// q1-q25: 0-4 Likert scale answers.
export const LIKERT_QUESTIONS: LikertQuestion[] = [
  { id: "q1", domain: "mood", polarity: "negative" },
  { id: "q2", domain: "mood", polarity: "negative" },
  { id: "q3", domain: "mood", polarity: "negative" },
  { id: "q4", domain: "anxiety", polarity: "negative" },
  { id: "q5", domain: "anxiety", polarity: "negative" },
  { id: "q6", domain: "anxiety", polarity: "negative" },
  { id: "q7", domain: "anxiety", polarity: "negative" },
  { id: "q8", domain: "stress", polarity: "negative" },
  { id: "q9", domain: "stress", polarity: "negative" },
  { id: "q10", domain: "stress", polarity: "negative" },
  { id: "q11", domain: "stress", polarity: "negative" },
  { id: "q12", domain: "sleep", polarity: "negative" },
  { id: "q13", domain: "sleep", polarity: "negative" },
  { id: "q14", domain: "sleep", polarity: "negative" },
  { id: "q15", domain: "academic", polarity: "negative" },
  { id: "q16", domain: "academic", polarity: "negative" },
  { id: "q17", domain: "academic", polarity: "negative" },
  { id: "q18", domain: "social", polarity: "negative" },
  { id: "q19", domain: "social", polarity: "negative" },
  { id: "q20", domain: "social", polarity: "negative" },
  { id: "q21", domain: "social", polarity: "negative" },
  { id: "q22", domain: "coping", polarity: "positive" },
  { id: "q23", domain: "coping", polarity: "positive" },
  { id: "q24", domain: "coping", polarity: "negative" },
  { id: "q25", domain: "coping", polarity: "positive" },
];

// q26-q29: Section G ("Safety"). Boolean yes/no; a single "yes" anywhere in
// this section is a crisis signal, handled independently of the LLM.
export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  { id: "q26" },
  { id: "q27" },
  { id: "q28" },
  { id: "q29" },
];

export const LIKERT_IDS = LIKERT_QUESTIONS.map((q) => q.id);
export const SAFETY_IDS = SAFETY_QUESTIONS.map((q) => q.id);
