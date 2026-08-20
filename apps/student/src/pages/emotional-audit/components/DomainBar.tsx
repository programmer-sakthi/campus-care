// components/DomainBar.tsx

import { Progress } from "@repo/ui/components/progress";
import { Badge } from "@repo/ui/components/badge";
import { cn } from "@repo/ui/lib/utils";
import type { DomainScore } from "../types/emotionalAudit.types";

const levelStyles: Record<DomainScore["level"], { badge: string; label: string }> = {
  LOW: { badge: "bg-teal-100 text-teal-800", label: "Low concern" },
  MODERATE: { badge: "bg-amber-100 text-amber-800", label: "Moderate" },
  HIGH: { badge: "bg-orange-100 text-orange-800", label: "Needs attention" },
};

interface DomainBarProps {
  domainScore: DomainScore;
}

export function DomainBar({ domainScore }: DomainBarProps) {
  const styles = levelStyles[domainScore.level];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">{domainScore.label}</p>
        <Badge className={cn("rounded-full", styles.badge)}>{styles.label}</Badge>
      </div>
      <Progress value={domainScore.score} className="h-2 rounded-full" />
    </div>
  );
}
