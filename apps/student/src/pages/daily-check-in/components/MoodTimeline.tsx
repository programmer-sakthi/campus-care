// components/MoodTimeline.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import type { MoodEntry, MoodTime } from "../types/dailyCheckIn.types";

interface MoodTimelineProps {
  moods: MoodEntry[];
}

const TIME_LABELS: Record<MoodTime, string> = {
  morning: "Morning",
  evening: "Evening",
  night: "Night",
};

export function MoodTimeline({ moods }: MoodTimelineProps) {
  const orderedTimes: MoodTime[] = ["morning", "evening", "night"];

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-700">
          Today&apos;s Mood Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between px-6 pb-6">
        {orderedTimes.map((time) => {
          const entry = moods.find((mood) => mood.time === time);
          return (
            <div key={time} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{entry ? entry.emoji : "—"}</span>
              <span className="text-xs text-slate-500">
                {TIME_LABELS[time]}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}