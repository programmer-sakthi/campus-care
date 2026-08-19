// components/WeeklyReview.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Badge } from "@repo/ui/components/badge";
import type { WeekOption } from "../types/dailyCheckIn.types";
import { trpc } from "../../../lib/trpc";

const weekOptionsList: { value: WeekOption; label: string }[] = [
  { value: "current", label: "Current Week" }, { value: "previous", label: "Previous Week" }, { value: "two_weeks_ago", label: "2 Weeks Ago" },
];
const offsets: Record<WeekOption, number> = { current: 0, previous: 1, two_weeks_ago: 2 };

export function WeeklyReview() {
  const [selectedWeek, setSelectedWeek] = useState<WeekOption>("current");
  const reviewQuery = useQuery(trpc.dailyCheckIn.weeklyReview.queryOptions({ offset: offsets[selectedWeek] }));
  const summary = reviewQuery.data;

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium text-slate-700">
          Weekly Review
        </CardTitle>
        <Select
          value={selectedWeek}
          onValueChange={(value) => setSelectedWeek(value as WeekOption)}
        >
          <SelectTrigger className="w-[160px] rounded-xl border-slate-200">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {weekOptionsList.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold text-slate-800">
              {summary ? summary.averageMood.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-slate-500">Avg. mood</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-800">
              {summary?.averageScore ?? "—"}
            </p>
            <p className="text-xs text-slate-500">Avg. score</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-800">
              {summary?.totalCheckIns ?? "—"}
            </p>
            <p className="text-xs text-slate-500">Check-ins</p>
          </div>
        </div>

        <Separator className="bg-slate-200" />

        <div>
          <p className="mb-2 text-sm text-slate-500">Common emotions</p>
          <div className="flex flex-wrap gap-2">
            {(summary?.commonEmotions ?? []).map((emotion) => (
              <Badge
                key={emotion}
                variant="outline"
                className="rounded-full border-slate-200 text-slate-600"
              >
                {emotion}
              </Badge>
            ))}
            {!reviewQuery.isLoading && summary?.commonEmotions.length === 0 && <p className="text-sm text-slate-500">No check-ins for this week yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
