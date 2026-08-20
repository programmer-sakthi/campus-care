// EmotionalAudit.tsx

import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";

import { AuditIntro } from "./components/AuditIntro";
import { AuditProgress } from "./components/AuditProgress";
import { CrisisSupport } from "./components/CrisisSupport";
import { EligibilityGate } from "./components/EligibilityGate";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsSummary } from "./components/ResultsSummary";
import { useEmotionalAudit } from "./hooks/useEmotionalAudit";

export default function EmotionalAudit() {
  const audit = useEmotionalAudit();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Emotional Audit</h1>
          <p className="text-sm text-slate-500">
            A deeper, periodic look at how you've really been doing.
          </p>
        </div>

        {audit.stage === "loading" && (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        )}

        {audit.stage === "locked" && audit.eligibility && (
          <EligibilityGate eligibility={audit.eligibility} />
        )}

        {audit.stage === "intro" && <AuditIntro onStart={() => audit.setStarted(true)} />}

        {audit.stage === "audit" && audit.currentQuestion && (
          <div className="space-y-4">
            <AuditProgress currentIndex={audit.currentIndex} total={audit.totalQuestions} />

            {audit.showCrisis ? (
              <CrisisSupport onContinue={audit.acknowledgeCrisis} />
            ) : (
              <>
                <QuestionCard
                  question={audit.currentQuestion}
                  eyebrow={audit.eyebrow}
                  intro={audit.intro}
                  likertValue={audit.likertAnswers[audit.currentQuestion.id]}
                  safetyValue={audit.safetyAnswers[audit.currentQuestion.id]}
                  onAnswerLikert={audit.answerLikert}
                  onAnswerSafety={audit.answerSafety}
                  onReviewSupport={audit.reviewSupportAgain}
                />

                <div className="flex gap-3">
                  {audit.currentIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={audit.goBack}
                      disabled={audit.submitting}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    className="flex-1 rounded-xl"
                    onClick={audit.goNext}
                    disabled={!audit.isAnswered || audit.submitting}
                  >
                    {audit.submitting
                      ? "Analysing your responses..."
                      : audit.isLastQuestion
                        ? "Finish audit"
                        : "Continue"}
                  </Button>
                </div>
              </>
            )}

            {audit.submitError && (
              <p className="text-sm text-red-600">
                Something went wrong saving your audit. Please try again.
              </p>
            )}
          </div>
        )}

        {audit.stage === "results" && audit.result && <ResultsSummary result={audit.result} />}
      </div>
    </div>
  );
}
