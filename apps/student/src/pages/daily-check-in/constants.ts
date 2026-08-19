import type { MoodOption } from "./types/dailyCheckIn.types";

export const moodOptions: MoodOption[] = [
  { level: "very_happy", emoji: "😀", label: "Very Happy", score: 5 },
  { level: "happy", emoji: "🙂", label: "Happy", score: 4 },
  { level: "neutral", emoji: "😐", label: "Neutral", score: 3 },
  { level: "sad", emoji: "🙁", label: "Sad", score: 2 },
  { level: "very_sad", emoji: "😞", label: "Very Sad", score: 1 },
];
