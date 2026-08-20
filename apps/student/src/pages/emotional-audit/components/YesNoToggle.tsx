// components/YesNoToggle.tsx

import { cn } from "@repo/ui/lib/utils";

interface YesNoToggleProps {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}

export function YesNoToggle({ value, onChange }: YesNoToggleProps) {
  const options: { label: string; boolValue: boolean }[] = [
    { label: "No", boolValue: false },
    { label: "Yes", boolValue: true },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {options.map((option) => {
        const isSelected = value === option.boolValue;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.boolValue)}
            className={cn(
              "h-10 min-w-24 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              isSelected
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-slate-300 bg-white text-slate-500 hover:border-teal-400 hover:text-teal-700"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
