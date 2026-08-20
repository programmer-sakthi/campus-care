// components/AuditProgress.tsx

import { Progress } from "@repo/ui/components/progress";

interface AuditProgressProps {
  currentIndex: number; // 0-based
  total: number;
}

export function AuditProgress({ currentIndex, total }: AuditProgressProps) {
  const percent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-1.5 rounded-full" />
    </div>
  );
}
