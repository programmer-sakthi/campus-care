// components/StreakCard.tsx

import { Card, CardContent } from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import type { StreakData } from "../types/dailyCheckIn.types";
import { formatFriendlyDate } from "../utils/formatDate";

interface StreakCardProps {
  streak: StreakData;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-teal-50 to-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-2xl font-semibold text-slate-800">
              {streak.currentStreak} Day Streak
            </p>
            <p className="text-sm text-slate-500">
              Keep taking care of yourself
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-200" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Longest streak</p>
            <p className="font-medium text-slate-800">
              {streak.longestStreak} days
            </p>
          </div>
          <div>
            <p className="text-slate-500">Last check-in</p>
            <p className="font-medium text-slate-800">
              {formatFriendlyDate(streak.lastCheckInDate)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}