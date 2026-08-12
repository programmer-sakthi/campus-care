// mockdata/aiInsights.mock.ts

import type { AIInsight } from "../types/dailyCheckIn.types";

export const mockAIInsights: AIInsight[] = [
  {
    id: "insight-1",
    message: "Your mood has improved compared to last week.",
  },
  {
    id: "insight-2",
    message: "Your sleep pattern is affecting your stress levels.",
  },
  {
    id: "insight-3",
    message: "Try maintaining a consistent sleep schedule.",
  },
];