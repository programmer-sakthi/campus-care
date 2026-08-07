// mockdata/dailyCheckIn.mock.ts

import type {
  CheckInAnswers,
  MoodEntry,
  MoodOption,
  StreakData,
} from "../types/dailyCheckIn.types";

export const moodOptions: MoodOption[] = [
  { level: "very_happy", emoji: "😀", label: "Very Happy", score: 5 },
  { level: "happy", emoji: "🙂", label: "Happy", score: 4 },
  { level: "neutral", emoji: "😐", label: "Neutral", score: 3 },
  { level: "sad", emoji: "🙁", label: "Sad", score: 2 },
  { level: "very_sad", emoji: "😞", label: "Very Sad", score: 1 },
];

export const mockTodayMoods: MoodEntry[] = [
  { time: "morning", mood: "happy", emoji: "🙂", score: 4 },
  { time: "evening", mood: "neutral", emoji: "😐", score: 3 },
  { time: "night", mood: "very_sad", emoji: "😞", score: 1 },
];

export const mockStreak: StreakData = {
  currentStreak: 12,
  longestStreak: 21,
  lastCheckInDate: "2025-06-10",
};

export const mockCheckInAnswers: CheckInAnswers = {
  sleepHours: 6,
  happyMoment: "Had a nice coffee catch-up with a friend.",
  stressfulMoment: "Felt overwhelmed with a work deadline in the evening.",
  waterIntake: "no",
  dailyReflection: "",
};