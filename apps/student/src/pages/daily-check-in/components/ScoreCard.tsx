// components/ScoreCard.tsx

import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { cn } from "@repo/ui/lib/utils";

interface ScoreCardProps {
  title: string;
  value: string;
  badgeLabel?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  accentClassName?: string;
}

export function ScoreCard({
  title,
  value,
  badgeLabel,
  badgeVariant = "secondary",
  accentClassName,
}: ScoreCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="flex flex-col items-start gap-2 p-5">
        <p className="text-sm text-slate-500">{title}</p>
        <p className={cn("text-2xl font-semibold text-slate-800", accentClassName)}>
          {value}
        </p>
        {badgeLabel ? (
          <Badge variant={badgeVariant} className="rounded-full">
            {badgeLabel}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}