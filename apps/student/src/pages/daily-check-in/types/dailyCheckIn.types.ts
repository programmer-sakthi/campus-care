// types/dailyCheckIn.types.ts

export type MoodTime = "morning" | "evening" | "night";

export type MoodLevel =
  | "very_happy"
  | "happy"
  | "neutral"
  | "sad"
  | "very_sad";

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
  score: number; // 1 - 5
}

export interface MoodEntry {
  time: MoodTime;
  mood: MoodLevel;
  emoji: string;
  score: number;
}

export type WaterIntakeAnswer = "yes" | "no" | null;

export interface CheckInAnswers {
  sleepHours: number | null;
  happyMoment: string;
  stressfulMoment: string;
  waterIntake: WaterIntakeAnswer;
  dailyReflection: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string; // ISO date string
}

export type ScoreCategory = "Excellent" | "Good" | "Needs Attention";

export interface MentalHealthScoreResult {
  score: number; // 0 - 100
  category: ScoreCategory;
}

export interface AIInsight {
  id: string;
  message: string;
}

export interface WeeklySummary {
  weekLabel: string;
  averageMood: number;
  averageScore: number;
  commonEmotions: string[];
  totalCheckIns: number;
}

export type WeekOption = "current" | "previous" | "two_weeks_ago";

export interface DailyCheckInState {
  moods: MoodEntry[];
  answers: CheckInAnswers;
  streak: StreakData;
}