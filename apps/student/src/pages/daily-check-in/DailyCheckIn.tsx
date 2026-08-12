// DailyCheckIn.tsx

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Separator } from "@repo/ui/components/separator";

import { StreakCard } from "./components/StreakCard";
import { MoodSelector } from "./components/MoodSelector";
import { MoodTimeline } from "./components/MoodTimeline";
import { CheckInQuestions } from "./components/CheckInQuestions";
import { MentalHealthScore } from "./components/MentalHealthScore";
import { AIInsights } from "./components/AIInsights";
import { WeeklyReview } from "./components/WeeklyReview";

import {
  mockCheckInAnswers,
  mockStreak,
  mockTodayMoods,
} from "./mockdata/dailyCheckIn.mock";
import { mockAIInsights } from "./mockdata/aiInsights.mock";

import { calculateMentalHealthScore } from "./utils/calculateScore";
import type {
  CheckInAnswers,
  MoodEntry,
  MoodLevel,
  MoodTime,
} from "./types/dailyCheckIn.types";
import { moodOptions } from "./mockdata/dailyCheckIn.mock";

const TIME_LABELS: Record<MoodTime, string> = {
  morning: "Morning Mood",
  evening: "Evening Mood",
  night: "Night Mood",
};

export default function DailyCheckIn() {
  const [moods, setMoods] = useState<MoodEntry[]>(mockTodayMoods);
  const [answers, setAnswers] = useState<CheckInAnswers>(mockCheckInAnswers);

  const handleMoodSelect = (time: MoodTime, mood: MoodLevel) => {
    const option = moodOptions.find((o) => o.level === mood);
    if (!option) return;

    setMoods((prev) => {
      const withoutTime = prev.filter((entry) => entry.time !== time);
      return [
        ...withoutTime,
        { time, mood, emoji: option.emoji, score: option.score },
      ];
    });
  };

  const getSelectedMood = (time: MoodTime): MoodLevel | null => {
    return moods.find((entry) => entry.time === time)?.mood ?? null;
  };

  const scoreResult = useMemo(
    () => calculateMentalHealthScore(moods, answers),
    [moods, answers]
  );

  const orderedTimes: MoodTime[] = ["morning", "evening", "night"];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Daily Check-In
          </h1>
          <p className="text-sm text-slate-500">
            A quiet moment to check in with yourself.
          </p>
        </div>

        <StreakCard streak={mockStreak} />

        <Tabs defaultValue="checkin" className="w-full">
          <TabsList className="rounded-xl bg-slate-100">
            <TabsTrigger value="checkin" className="rounded-lg">
              Check-In
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-lg">
              Weekly Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-6 pt-4">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium text-slate-700">
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {orderedTimes.map((time, index) => (
                  <div key={time}>
                    <MoodSelector
                      time={time}
                      label={TIME_LABELS[time]}
                      selectedMood={getSelectedMood(time)}
                      onSelect={handleMoodSelect}
                    />
                    {index < orderedTimes.length - 1 && (
                      <Separator className="mt-5 bg-slate-100" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <MoodTimeline moods={moods} />

            <CheckInQuestions answers={answers} onChange={setAnswers} />

            <MentalHealthScore result={scoreResult} />

            <AIInsights insights={mockAIInsights} />
          </TabsContent>

          <TabsContent value="review" className="pt-4">
            <WeeklyReview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}