// components/EligibilityGate.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import type { EligibilityState } from "../types/emotionalAudit.types";
import { formatFriendlyDateTime, formatHoursRemaining } from "../utils/countdown";

interface EligibilityGateProps {
  eligibility: EligibilityState;
}

export function EligibilityGate({ eligibility }: EligibilityGateProps) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-700">
          <span aria-hidden>🕒</span> Emotional Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          You've already taken the Emotional Audit recently. To keep results
          meaningful, it can only be retaken every 10 days.
        </p>

        <div className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-4">
          <Badge className="rounded-full bg-teal-100 text-teal-800">
            Available in {formatHoursRemaining(eligibility.hoursRemaining)}
          </Badge>
          <p className="text-xs text-slate-500">
            Last taken: {formatFriendlyDateTime(eligibility.lastSubmittedAt)}
          </p>
          <p className="text-xs text-slate-500">
            Next available: {formatFriendlyDateTime(eligibility.nextAvailableAt)}
          </p>
        </div>

        <p className="text-sm text-slate-500">
          In the meantime, your Daily Check-In and Emora companion are always
          available if you'd like to talk something through.
        </p>
      </CardContent>
    </Card>
  );
}
