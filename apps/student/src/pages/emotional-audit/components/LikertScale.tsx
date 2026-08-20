// components/LikertScale.tsx

import { cn } from "@repo/ui/lib/utils";

interface LikertScaleProps {
  labels: string[]; // 5 labels, index 0-4
  value: number | undefined;
  onChange: (value: number) => void;
}

export function LikertScale({ labels, value, onChange }: LikertScaleProps) {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        {labels.map((label, index) => {
          const isSelected = value === index;
          return (
            <button
              key={label}
              type="button"
              aria-label={label}
              aria-pressed={isSelected}
              onClick={() => onChange(index)}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                isSelected
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 bg-white text-slate-500 hover:border-teal-400 hover:text-teal-700"
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>

      <p className="h-4 text-center text-xs font-medium text-teal-700">
        {value !== undefined ? labels[value] : "\u00A0"}
      </p>
    </div>
  );
}
