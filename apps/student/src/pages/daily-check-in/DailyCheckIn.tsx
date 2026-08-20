// DailyCheckIn.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Separator } from "@repo/ui/components/separator";
import { Button } from "@repo/ui/components/button";

import { StreakCard } from "./components/StreakCard";
import { MoodSelector } from "./components/MoodSelector";
import { MoodTimeline } from "./components/MoodTimeline";
import { CheckInQuestions } from "./components/CheckInQuestions";
import { MentalHealthScore } from "./components/MentalHealthScore";
import { AIInsights } from "./components/AIInsights";
import { WeeklyReview } from "./components/WeeklyReview";

import type {
  CheckInAnswers,
  MoodEntry,
  MoodLevel,
  MoodTime,
} from "./types/dailyCheckIn.types";
import { trpc, trpcClient } from "../../lib/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { moodOptions } from "./constants";

const emptyAnswers: CheckInAnswers = { sleepHours: null, happyMoment: "", stressfulMoment: "", waterIntake: null, dailyReflection: "" };
const emptyStreak = { currentStreak: 0, longestStreak: 0, lastCheckInDate: "" };
type StoredCheckIn = {
  answers: unknown;
  insights: unknown;
  mentalHealthScore: number | null;
  moods: { time: "MORNING" | "EVENING" | "NIGHT"; mood: "VERY_GOOD" | "GOOD" | "NEUTRAL" | "BAD" | "VERY_BAD" }[];
};
type TodayResponse = { checkIn: StoredCheckIn | null; streak: { currentStreak: number; longestStreak: number; lastCheckInDate: string | null } };

const TIME_LABELS: Record<MoodTime, string> = {
  morning: "Morning Mood",
  evening: "Evening Mood",
  night: "Night Mood",
};

export default function DailyCheckIn() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [answers, setAnswers] = useState<CheckInAnswers>(emptyAnswers);
  const [result, setResult] = useState<{ score: number; category: "Excellent" | "Good" | "Needs Attention"; insights: string[] }>();
  const todayQuery = useQuery(trpc.dailyCheckIn.today.queryOptions());
  const today = todayQuery.data as TodayResponse | undefined;
  const submit = useMutation({
    mutationFn: (input: { moods: { time: MoodTime; mood: MoodLevel }[]; answers: CheckInAnswers }) => trpcClient.dailyCheckIn.submit.mutate(input),
    onSuccess: (data) => {
      setResult(data.result);
      void todayQuery.refetch();
    },
  });

  useEffect(() => {
    const checkIn = today?.checkIn;
    if (!checkIn) return;
    const savedAnswers = checkIn.answers as CheckInAnswers | null;
    if (savedAnswers) setAnswers(savedAnswers);
    setMoods(checkIn.moods.map((entry) => {
      const mood = ({ VERY_GOOD: "very_happy", GOOD: "happy", NEUTRAL: "neutral", BAD: "sad", VERY_BAD: "very_sad" } as const)[entry.mood];
      const option = moodOptions.find((item) => item.level === mood)!;
      return { time: entry.time.toLowerCase() as MoodTime, mood, emoji: option.emoji, score: option.score };
    }));
    if (checkIn.mentalHealthScore !== null) setResult({ score: checkIn.mentalHealthScore, category: checkIn.mentalHealthScore >= 80 ? "Excellent" : checkIn.mentalHealthScore >= 60 ? "Good" : "Needs Attention", insights: (checkIn.insights as string[] | null) ?? [] });
  }, [today]);

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

        <StreakCard streak={today?.streak.lastCheckInDate ? { ...today.streak, lastCheckInDate: today.streak.lastCheckInDate } : emptyStreak} />

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

            <Button className="w-full rounded-xl" disabled={moods.length === 0 || submit.isPending} onClick={() => submit.mutate({ moods: moods.map(({ time, mood }) => ({ time, mood })), answers })}>
              {submit.isPending ? "Analysing your check-in..." : "Save check-in and get insights"}
            </Button>
            {submit.isError && <p className="text-sm text-red-600">Unable to analyse your check-in. Please try again.</p>}
            {result && <MentalHealthScore result={result} />}
            {result?.insights.length ? <AIInsights insights={result.insights.map((message, index) => ({ id: `${index}-${message}`, message }))} /> : null}
          </TabsContent>

          <TabsContent value="review" className="pt-4">
            <WeeklyReview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
