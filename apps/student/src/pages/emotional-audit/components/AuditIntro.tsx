// components/AuditIntro.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

interface AuditIntroProps {
  onStart: () => void;
}

const TOPICS = [
  "Mood, anxiety, stress & sleep",
  "Academic & daily functioning",
  "Social connection & coping",
  "A few important safety questions",
];

export function AuditIntro({ onStart }: AuditIntroProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-slate-700">
          A more in-depth check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-slate-600">
          The Emotional Audit is a short, structured screening — about 29
          questions across a few areas of wellbeing. It takes most people
          5-8 minutes. This isn't a diagnosis; it's a way to notice patterns
          and get gentle, practical suggestions.
        </p>

        <ul className="space-y-2">
          {TOPICS.map((topic) => (
            <li key={topic} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              {topic}
            </li>
          ))}
        </ul>

        <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          Your answers are private and only shared with your college's
          counselling team if you choose to book an appointment. You can
          retake this audit every 10 days.
        </p>

        <Button className="w-full rounded-xl" onClick={onStart}>
          Start Emotional Audit
        </Button>
      </CardContent>
    </Card>
  );
}
