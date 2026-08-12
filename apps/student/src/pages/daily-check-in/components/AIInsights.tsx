// components/AIInsights.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import type { AIInsight } from "../types/dailyCheckIn.types";

interface AIInsightsProps {
  insights: AIInsight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-slate-50/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-700">
          <span aria-hidden>✨</span> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <p
            key={insight.id}
            className="rounded-xl bg-white p-3 text-sm text-slate-600 shadow-sm"
          >
            {insight.message}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}