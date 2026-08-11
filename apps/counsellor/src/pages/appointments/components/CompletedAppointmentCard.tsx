import { Building2, CalendarClock, CheckCircle2, PenLine } from "lucide-react";

import { Card, CardContent, CardHeader } from "@repo/ui/components/card";

import { Badge } from "@repo/ui/components/badge";
import type { Appointment } from "../types/appointment";

import { formatDateTime } from "../utils/date";

import { nameFont } from "../utils/styles";

interface Props {
  appointment: Appointment;
}

export function CompletedAppointmentCard({ appointment }: Props) {
  const studentName = appointment.student.name ?? "Student";
  const institutionName =
    appointment.student.institution.name ??
    appointment.student.institution.code;

  return (
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              className="text-lg font-medium text-neutral-900"
              style={nameFont}
            >
              {studentName}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />

                {institutionName}
              </span>

              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />

                {formatDateTime(
                  appointment.completedAt ??
                    appointment.scheduledAt ??
                    undefined,
                )}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="gap-1.5 border-neutral-200 text-neutral-500"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-600">Reason:</span>{" "}
          {appointment.reason}
        </p>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <PenLine className="h-3.5 w-3.5" />
            Session review
          </p>
          <p className="whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
            {appointment.sessionNote || "No session note was recorded."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
