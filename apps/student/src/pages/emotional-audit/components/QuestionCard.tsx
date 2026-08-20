// components/QuestionCard.tsx
//
// One question per screen, Typeform-style: the question is the largest,
// most prominent thing on screen; the answer control stays compact beneath
// it so options never compete visually with the question itself.

import { Card, CardContent } from "@repo/ui/components/card";
import { LikertScale } from "./LikertScale";
import { YesNoToggle } from "./YesNoToggle";
import { SCALE_LABELS } from "../constants/questions";
import type { AuditQuestion } from "../types/emotionalAudit.types";

interface QuestionCardProps {
  question: AuditQuestion;
  eyebrow: string;
  intro: string | null;
  likertValue: number | undefined;
  safetyValue: boolean | undefined;
  onAnswerLikert: (value: number) => void;
  onAnswerSafety: (value: boolean) => void;
  onReviewSupport?: () => void;
}

export function QuestionCard({
  question,
  eyebrow,
  intro,
  likertValue,
  safetyValue,
  onAnswerLikert,
  onAnswerSafety,
  onReviewSupport,
}: QuestionCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
        <p className="text-xs font-semibold tracking-wide text-teal-600 uppercase">{eyebrow}</p>

        {intro && <p className="-mt-4 text-xs text-slate-400">{intro}</p>}

        <h2 className="text-balance text-xl leading-snug font-semibold text-slate-800 sm:text-2xl">
          {question.text}
        </h2>

        <div className="w-full pt-2">
          {question.kind === "likert" ? (
            <LikertScale
              labels={SCALE_LABELS[question.scaleType][question.polarity]}
              value={likertValue}
              onChange={onAnswerLikert}
            />
          ) : (
            <YesNoToggle value={safetyValue} onChange={onAnswerSafety} />
          )}
        </div>

        {question.kind === "safety" && safetyValue === true && onReviewSupport && (
          <button
            type="button"
            onClick={onReviewSupport}
            className="text-xs font-medium text-orange-700 underline underline-offset-2"
          >
            View support resources again
          </button>
        )}
      </CardContent>
    </Card>
  );
}
