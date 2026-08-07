// components/CheckInQuestions.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import type { CheckInAnswers, WaterIntakeAnswer } from "../types/dailyCheckIn.types";
import { cn } from "@repo/ui/lib/utils";

interface CheckInQuestionsProps {
  answers: CheckInAnswers;
  onChange: (answers: CheckInAnswers) => void;
}

export function CheckInQuestions({ answers, onChange }: CheckInQuestionsProps) {
  const updateField = <K extends keyof CheckInAnswers>(
    field: K,
    value: CheckInAnswers[K]
  ) => {
    onChange({ ...answers, [field]: value });
  };

  const waterOptions: { value: WaterIntakeAnswer; label: string }[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-700">
          Daily Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            How many hours did you sleep yesterday?
          </Label>
          <Input
            type="number"
            min={0}
            max={24}
            value={answers.sleepHours ?? ""}
            onChange={(e) =>
              updateField(
                "sleepHours",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            placeholder="e.g. 7"
            className="max-w-[140px] rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            Did something make you happy today?
          </Label>
          <Textarea
            value={answers.happyMoment}
            onChange={(e) => updateField("happyMoment", e.target.value)}
            placeholder="Write a few words..."
            className="rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            Did something make you feel stressed today?
          </Label>
          <Textarea
            value={answers.stressfulMoment}
            onChange={(e) => updateField("stressfulMoment", e.target.value)}
            placeholder="Write a few words..."
            className="rounded-xl border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            Did you drink enough water today?
          </Label>
          <div className="flex gap-2">
            {waterOptions.map((option) => {
              const isSelected = answers.waterIntake === option.value;
              return (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  onClick={() => updateField("waterIntake", option.value)}
                  className={cn(
                    "rounded-xl border-slate-200 px-5",
                    isSelected
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-slate-600">
            Tell me about your day{" "}
            <span className="text-slate-400">(optional)</span>
          </Label>
          <Textarea
            value={answers.dailyReflection}
            onChange={(e) => updateField("dailyReflection", e.target.value)}
            placeholder="Anything else on your mind..."
            className="rounded-xl border-slate-200"
          />
        </div>
      </CardContent>
    </Card>
  );
}