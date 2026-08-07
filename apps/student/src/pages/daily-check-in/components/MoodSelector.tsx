// components/MoodSelector.tsx

import { Button } from "@repo/ui/components/button";
import { moodOptions } from "../mockdata/dailyCheckIn.mock";
import type { MoodLevel, MoodTime } from "../types/dailyCheckIn.types";
import { cn } from "@repo/ui/lib/utils";

interface MoodSelectorProps {
  time: MoodTime;
  label: string;
  selectedMood: MoodLevel | null;
  onSelect: (time: MoodTime, mood: MoodLevel) => void;
}

export function MoodSelector({
  time,
  label,
  selectedMood,
  onSelect,
}: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <div className="flex flex-wrap gap-2">
        {moodOptions.map((option) => {
          const isSelected = selectedMood === option.level;
          return (
            <Button
              key={option.level}
              type="button"
              variant="outline"
              onClick={() => onSelect(time, option.level)}
              className={cn(
                "flex h-auto flex-col items-center gap-1 rounded-xl border-slate-200 px-3 py-2 transition-colors",
                isSelected
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="text-xl leading-none">{option.emoji}</span>
              <span className="text-[11px] font-normal">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}