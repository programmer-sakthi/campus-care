// components/MentalHealthScore.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { Badge } from "@repo/ui/components/badge";
import type { MentalHealthScoreResult } from "../types/dailyCheckIn.types";
import { cn } from "@repo/ui/lib/utils";

interface MentalHealthScoreProps {
  result: MentalHealthScoreResult;
}

const categoryStyles: Record<
  MentalHealthScoreResult["category"],
  { badge: string; text: string }
> = {
  Excellent: {
    badge: "bg-teal-100 text-teal-800",
    text: "text-teal-700",
  },
  Good: {
    badge: "bg-sky-100 text-sky-800",
    text: "text-sky-700",
  },
  "Needs Attention": {
    badge: "bg-amber-100 text-amber-800",
    text: "text-amber-700",
  },
};
export function MentalHealthScore({ result }: MentalHealthScoreProps) {
  const styles = categoryStyles[result.category];

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-700">
          Mental Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <p className={cn("text-3xl font-semibold", styles.text)}>
            {result.score}
            <span className="text-base font-normal text-slate-400">/100</span>
          </p>
          <Badge className={cn("rounded-full", styles.badge)}>
            {result.category}
          </Badge>
        </div>
        <Progress value={result.score} className="h-2 rounded-full" />
      </CardContent>
    </Card>
  );
}