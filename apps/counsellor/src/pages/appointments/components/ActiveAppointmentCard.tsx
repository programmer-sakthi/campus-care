import { Building2, CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

import type { Appointment } from "../types/appointment";

import { formatDateTime, timeAgo } from "../utils/date";

import { nameFont } from "../utils/styles";

interface Props {
  appointment: Appointment;
  onSchedule: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
}

export function ActiveAppointmentCard({
  appointment,
  onSchedule,
  onComplete,
}: Props) {
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

            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
              <Building2 className="h-3.5 w-3.5" />

              {institutionName}
            </div>
          </div>

          {appointment.status === "PENDING" ? (
            <Badge className="border-none bg-[#F3E4C9] text-[#7A5A17]">
              Awaiting a time
            </Badge>
          ) : (
            <Badge className="border-none bg-[#EDF2EF] text-[#3F5A4E]">
              Scheduled
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="rounded-lg border-l-2 border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm">
          {appointment.reason}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400">
          <Clock3 className="h-3.5 w-3.5" />
          Requested {timeAgo(appointment.requestedAt)}
        </div>

        {appointment.scheduledAt && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#3F5A4E]">
            <CalendarClock className="h-4 w-4" />

            {formatDateTime(appointment.scheduledAt)}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {appointment.status === "PENDING" ? (
          <Button
            className="flex-1 bg-neutral-900"
            onClick={() => onSchedule(appointment)}
          >
            <CalendarClock className="h-4 w-4" /> Schedule session
          </Button>
        ) : (
          <Button
            className="flex-1 bg-neutral-900"
            onClick={() => onComplete(appointment)}
          >
            <CheckCircle2 className="h-4 w-4" /> Complete session
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
