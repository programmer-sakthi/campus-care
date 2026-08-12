// mockdata/weeklyReview.mock.ts

import type { WeeklySummary, WeekOption } from "../types/dailyCheckIn.types";

export const mockWeeklySummaries: Record<WeekOption, WeeklySummary> = {
  current: {
    weekLabel: "Current Week",
    averageMood: 3.4,
    averageScore: 74,
    commonEmotions: ["Happy", "Neutral", "Stressed"],
    totalCheckIns: 6,
  },
  previous: {
    weekLabel: "Previous Week",
    averageMood: 3.1,
    averageScore: 68,
    commonEmotions: ["Neutral", "Tired", "Calm"],
    totalCheckIns: 7,
  },
  two_weeks_ago: {
    weekLabel: "2 Weeks Ago",
    averageMood: 2.8,
    averageScore: 61,
    commonEmotions: ["Stressed", "Sad", "Tired"],
    totalCheckIns: 5,
  },
};

export const weekOptionsList: { value: WeekOption; label: string }[] = [
  { value: "current", label: "Current Week" },
  { value: "previous", label: "Previous Week" },
  { value: "two_weeks_ago", label: "2 Weeks Ago" },
];