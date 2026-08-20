// constants/questions.ts
//
// Mirrors apps/backend/src/lib/emotionalAuditQuestions.ts — ids, order, and
// domains must stay in sync with the backend, since scoring happens there.
// This file additionally carries display text and scale type, which the
// backend doesn't need.

import type { AuditQuestion, LikertQuestion, SafetyQuestion } from "../types/emotionalAudit.types";
import { DOMAIN_INTROS, DOMAIN_LABELS, SAFETY_INTRO } from "./domains";

export const LIKERT_QUESTIONS: LikertQuestion[] = [
  // A. Mood
  { id: "q1", domain: "mood", polarity: "negative", scaleType: "frequency", text: "How often have you felt down, low, or sad?" },
  { id: "q2", domain: "mood", polarity: "negative", scaleType: "frequency", text: "How often have you experienced sudden mood swings?" },
  { id: "q3", domain: "mood", polarity: "negative", scaleType: "frequency", text: "How often have you felt emotionally numb or empty?" },

  // B. Anxiety
  { id: "q4", domain: "anxiety", polarity: "negative", scaleType: "frequency", text: "How often have you felt nervous, anxious, or on edge?" },
  { id: "q5", domain: "anxiety", polarity: "negative", scaleType: "frequency", text: "How often have you found it hard to stop or control worrying?" },
  { id: "q6", domain: "anxiety", polarity: "negative", scaleType: "frequency", text: "How often have you felt restless or unable to sit still?" },
  { id: "q7", domain: "anxiety", polarity: "negative", scaleType: "frequency", text: "How often has worry shown up physically, like a racing heart or tight chest?" },

  // C. Stress
  { id: "q8", domain: "stress", polarity: "negative", scaleType: "frequency", text: "How often have you felt overwhelmed by your responsibilities?" },
  { id: "q9", domain: "stress", polarity: "negative", scaleType: "frequency", text: "How often have you felt like things are piling up and out of your control?" },
  { id: "q10", domain: "stress", polarity: "negative", scaleType: "frequency", text: "How often have you felt irritable or on edge because of stress?" },
  { id: "q11", domain: "stress", polarity: "negative", scaleType: "frequency", text: "How often has stress shown up physically, like headaches or a tense stomach?" },

  // D. Sleep
  { id: "q12", domain: "sleep", polarity: "negative", scaleType: "frequency", text: "How often have you had trouble falling or staying asleep?" },
  { id: "q13", domain: "sleep", polarity: "negative", scaleType: "frequency", text: "How often have you woken up feeling unrested?" },
  { id: "q14", domain: "sleep", polarity: "negative", scaleType: "frequency", text: "How often has your sleep schedule felt out of your control?" },

  // Academic & Daily Functioning
  { id: "q15", domain: "academic", polarity: "negative", scaleType: "frequency", text: "How often have you found it hard to concentrate on schoolwork?" },
  { id: "q16", domain: "academic", polarity: "negative", scaleType: "frequency", text: "How often have you fallen behind on assignments or classes?" },
  { id: "q17", domain: "academic", polarity: "negative", scaleType: "frequency", text: "How often have you struggled to complete normal daily activities?" },

  // E. Social & Emotional Well-being
  { id: "q18", domain: "social", polarity: "negative", scaleType: "frequency", text: "How often have you felt lonely even when around other people?" },
  { id: "q19", domain: "social", polarity: "negative", scaleType: "frequency", text: "How often have you avoided friends, classmates, or social activities?" },
  { id: "q20", domain: "social", polarity: "negative", scaleType: "frequency", text: "How often have you felt that you don't have anyone you can talk to?" },
  { id: "q21", domain: "social", polarity: "negative", scaleType: "frequency", text: "How often have you felt like you don't belong at college?" },

  // F. Coping
  { id: "q22", domain: "coping", polarity: "positive", scaleType: "confidence", text: "When you're stressed, how confident are you in your ability to cope?" },
  { id: "q23", domain: "coping", polarity: "positive", scaleType: "frequency", text: "How often do you engage in activities that help you relax or recover?" },
  { id: "q24", domain: "coping", polarity: "negative", scaleType: "frequency", text: "How often do you feel that your current coping methods aren't working?" },
  { id: "q25", domain: "coping", polarity: "positive", scaleType: "support", text: "How supported do you feel by your friends, family, teachers, or college community?" },
];

// G. Safety — deliberately kept separate and simple (yes/no). A single
// "yes" switches the whole experience into the crisis-support flow.
export const SAFETY_QUESTIONS: SafetyQuestion[] = [
  { id: "q26", text: "Have you recently felt that life is not worth living?" },
  { id: "q27", text: "Have you recently had thoughts of hurting yourself?" },
  { id: "q28", text: "Have you recently thought about ending your life?" },
  { id: "q29", text: "Do you feel that you might hurt yourself right now?" },
];

// Flat, presentation-ordered question list (q1..q29) for the
// one-question-per-screen flow. Order matches the audit's A-G structure.
export const ALL_QUESTIONS: AuditQuestion[] = [
  ...LIKERT_QUESTIONS.map((q): AuditQuestion => ({ ...q, kind: "likert" })),
  ...SAFETY_QUESTIONS.map((q): AuditQuestion => ({ ...q, kind: "safety" })),
];

/** Small "you're now in X" label shown above each question. */
export function eyebrowFor(question: AuditQuestion): string {
  return question.kind === "likert" ? DOMAIN_LABELS[question.domain] : "Safety";
}

/** One-line intro shown the moment the student reaches a new domain's
 * first question — a lightweight section break within the flat flow. */
export function introFor(question: AuditQuestion): string | null {
  return question.kind === "likert" ? DOMAIN_INTROS[question.domain] : SAFETY_INTRO;
}

/** True for the first question of each domain/section, so the UI can show
 * the section intro only once rather than on every question. */
export function isFirstOfSection(question: AuditQuestion, index: number): boolean {
  if (index === 0) return true;
  const previous = ALL_QUESTIONS[index - 1];
  const previousKey = previous.kind === "likert" ? previous.domain : "safety";
  const currentKey = question.kind === "likert" ? question.domain : "safety";
  return previousKey !== currentKey;
}

export const SCALE_LABELS: Record<
  LikertQuestion["scaleType"],
  Record<LikertQuestion["polarity"], string[]>
> = {
  frequency: {
    negative: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    positive: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  confidence: {
    negative: ["Not at all", "Slightly", "Somewhat", "Confident", "Very confident"],
    positive: ["Not at all", "Slightly", "Somewhat", "Confident", "Very confident"],
  },
  support: {
    negative: ["Not at all", "Slightly", "Somewhat", "Supported", "Very supported"],
    positive: ["Not at all", "Slightly", "Somewhat", "Supported", "Very supported"],
  },
};
