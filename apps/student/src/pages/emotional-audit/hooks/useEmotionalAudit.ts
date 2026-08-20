// hooks/useEmotionalAudit.ts

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { trpc, trpcClient } from "../../../lib/trpc";
import { ALL_QUESTIONS, eyebrowFor, introFor, isFirstOfSection } from "../constants/questions";
import type {
  AuditResult,
  EligibilityState,
  LikertAnswers,
  SafetyAnswers,
} from "../types/emotionalAudit.types";

export type AuditStage = "loading" | "locked" | "intro" | "audit" | "results";

// Small pause before auto-advancing to the next question after an answer,
// so the selection is visibly registered before the screen changes.
const AUTO_ADVANCE_MS = 380;

export function useEmotionalAudit() {
  const eligibilityQuery = useQuery(trpc.emotionalAudit.eligibility.queryOptions());
  const eligibility = eligibilityQuery.data as EligibilityState | undefined;

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likertAnswers, setLikertAnswers] = useState<LikertAnswers>({});
  const [safetyAnswers, setSafetyAnswers] = useState<SafetyAnswers>({});
  // Question ids for which the student has already clicked past the
  // in-flow crisis screen. Re-visiting an already-acknowledged "yes" (e.g.
  // via Back) shows the normal question again rather than re-interrupting.
  const [acknowledgedCrisisIds, setAcknowledgedCrisisIds] = useState<string[]>([]);
  const [result, setResult] = useState<AuditResult>();

  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(autoAdvanceTimeout.current), []);

  const submit = useMutation({
    mutationFn: () =>
      trpcClient.emotionalAudit.submit.mutate({ likertAnswers, safetyAnswers }),
    onSuccess: (data) => {
      setResult(data.result as AuditResult);
      void eligibilityQuery.refetch();
    },
  });

  const totalQuestions = ALL_QUESTIONS.length;
  const currentQuestion = ALL_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const isAnswered =
    currentQuestion?.kind === "likert"
      ? likertAnswers[currentQuestion.id] !== undefined
      : currentQuestion
        ? safetyAnswers[currentQuestion.id] !== undefined
        : false;

  const showCrisis =
    currentQuestion?.kind === "safety" &&
    safetyAnswers[currentQuestion.id] === true &&
    !acknowledgedCrisisIds.includes(currentQuestion.id);

  function clearAutoAdvance() {
    clearTimeout(autoAdvanceTimeout.current);
  }

  function goNext() {
    clearAutoAdvance();
    if (!isAnswered) return;
    if (isLastQuestion) {
      submit.mutate();
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, totalQuestions - 1));
  }

  function goBack() {
    clearAutoAdvance();
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }

  function scheduleAutoAdvance() {
    clearAutoAdvance();
    if (isLastQuestion) return; // final question always needs an explicit "Finish"
    autoAdvanceTimeout.current = setTimeout(goNext, AUTO_ADVANCE_MS);
  }

  function answerLikert(value: number) {
    if (!currentQuestion || currentQuestion.kind !== "likert") return;
    const questionId = currentQuestion.id;
    setLikertAnswers((prev) => ({ ...prev, [questionId]: value }));
    scheduleAutoAdvance();
  }

  function answerSafety(value: boolean) {
    if (!currentQuestion || currentQuestion.kind !== "safety") return;
    const questionId = currentQuestion.id;
    setSafetyAnswers((prev) => ({ ...prev, [questionId]: value }));
    // A "yes" needs to interrupt the flow with support resources rather
    // than quietly advancing — never auto-advance past a crisis signal.
    if (value === false) scheduleAutoAdvance();
  }

  function acknowledgeCrisis() {
    if (!currentQuestion) return;
    setAcknowledgedCrisisIds((prev) => [...prev, currentQuestion.id]);
    goNext();
  }

  function reviewSupportAgain() {
    if (!currentQuestion) return;
    setAcknowledgedCrisisIds((prev) => prev.filter((id) => id !== currentQuestion.id));
  }

  function restart() {
    setStarted(false);
    setCurrentIndex(0);
    setLikertAnswers({});
    setSafetyAnswers({});
    setAcknowledgedCrisisIds([]);
    setResult(undefined);
    submit.reset();
  }

  const stage: AuditStage = eligibilityQuery.isLoading
    ? "loading"
    : result
      ? "results"
      : eligibility && !eligibility.eligible
        ? "locked"
        : started
          ? "audit"
          : "intro";

  return {
    stage,
    eligibility,
    started,
    setStarted,
    totalQuestions,
    currentIndex,
    currentQuestion,
    eyebrow: currentQuestion ? eyebrowFor(currentQuestion) : "",
    intro:
      currentQuestion && isFirstOfSection(currentQuestion, currentIndex)
        ? introFor(currentQuestion)
        : null,
    isAnswered,
    isLastQuestion,
    showCrisis,
    likertAnswers,
    safetyAnswers,
    answerLikert,
    answerSafety,
    acknowledgeCrisis,
    reviewSupportAgain,
    goNext,
    goBack,
    restart,
    submitting: submit.isPending,
    submitError: submit.isError,
    result,
  };
}
