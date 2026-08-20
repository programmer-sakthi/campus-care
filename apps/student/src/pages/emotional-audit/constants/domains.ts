// constants/domains.ts

import type { DomainId } from "../types/emotionalAudit.types";

export const DOMAIN_LABELS: Record<DomainId, string> = {
  mood: "Mood",
  anxiety: "Anxiety",
  stress: "Stress",
  sleep: "Sleep",
  academic: "Academic Functioning",
  social: "Social & Emotional Well-being",
  coping: "Coping",
};

// Short, human copy shown once per domain the moment the student reaches
// its first question — a lightweight "section break" rather than a whole
// separate screen, so the one-question-per-screen flow doesn't lose the
// sense of moving through distinct topics.
export const DOMAIN_INTROS: Record<DomainId, string> = {
  mood: "A few questions about how you've generally been feeling.",
  anxiety: "How worry and nervousness have shown up lately.",
  stress: "How manageable your day-to-day load has felt.",
  sleep: "How rested you've been feeling.",
  academic: "How things have been going with classes and daily tasks.",
  social: "How connected you've been feeling to people around you.",
  coping: "How you've been managing stress, and the support around you.",
};

export const SAFETY_INTRO =
  "A few important questions we ask everyone — answered honestly, just for you.";
