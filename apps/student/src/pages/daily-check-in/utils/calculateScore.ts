// utils/calculateScore.ts

import type {
  CheckInAnswers,
  MentalHealthScoreResult,
  MoodEntry,
  ScoreCategory,
} from "../types/dailyCheckIn.types";

const MAX_MOOD_POINTS = 30; // up to 3 moods * 10 pts (score 5 -> 10 pts)
const MAX_SLEEP_POINTS = 25;
const MAX_STRESS_POINTS = 15;
const MAX_WATER_POINTS = 15;
const MAX_REFLECTION_POINTS = 15;

function getMoodPoints(moods: MoodEntry[]): number {
  if (moods.length === 0) return 0;

  const totalMoodScore = moods.reduce((sum, entry) => sum + entry.score, 0);
  const averageMoodScore = totalMoodScore / moods.length; // 1 - 5
  return Math.round((averageMoodScore / 5) * MAX_MOOD_POINTS);
}

function getSleepPoints(sleepHours: number | null): number {
  if (sleepHours === null) return 0;

  // Ideal sleep range treated as 7 - 9 hours
  if (sleepHours >= 7 && sleepHours <= 9) return MAX_SLEEP_POINTS;
  if (sleepHours >= 6 && sleepHours < 7) return MAX_SLEEP_POINTS * 0.7;
  if (sleepHours > 9 && sleepHours <= 10) return MAX_SLEEP_POINTS * 0.7;
  if (sleepHours >= 4 && sleepHours < 6) return MAX_SLEEP_POINTS * 0.4;
  return MAX_SLEEP_POINTS * 0.2;
}

function getStressPoints(stressfulMoment: string): number {
  // Simple mock heuristic: an empty answer is treated as neutral,
  // a filled-in answer is treated as healthy reflection/awareness.
  const trimmed = stressfulMoment.trim();
  if (trimmed.length === 0) return MAX_STRESS_POINTS * 0.6;
  return MAX_STRESS_POINTS;
}

function getWaterPoints(waterIntake: CheckInAnswers["waterIntake"]): number {
  if (waterIntake === "yes") return MAX_WATER_POINTS;
  if (waterIntake === "no") return MAX_WATER_POINTS * 0.3;
  return 0;
}

function getReflectionPoints(dailyReflection: string): number {
  const trimmed = dailyReflection.trim();
  if (trimmed.length === 0) return MAX_REFLECTION_POINTS * 0.5;
  return MAX_REFLECTION_POINTS;
}

function getCategory(score: number): ScoreCategory {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Good";
  return "Needs Attention";
}

export function calculateMentalHealthScore(
  moods: MoodEntry[],
  answers: CheckInAnswers
): MentalHealthScoreResult {
  const moodPoints = getMoodPoints(moods);
  const sleepPoints = getSleepPoints(answers.sleepHours);
  const stressPoints = getStressPoints(answers.stressfulMoment);
  const waterPoints = getWaterPoints(answers.waterIntake);
  const reflectionPoints = getReflectionPoints(answers.dailyReflection);

  const rawScore =
    moodPoints + sleepPoints + stressPoints + waterPoints + reflectionPoints;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    score,
    category: getCategory(score),
  };
}