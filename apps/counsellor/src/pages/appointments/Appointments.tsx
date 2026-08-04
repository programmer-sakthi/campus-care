import { useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquare,
  PenLine,
} from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import {
  appointments as initialAppointments,
  institutionOf,
  studentOf,
  type Appointment,
} from "./mock-data.ts";

// Every person's name renders in Fraunces; everything the system
// generates (badges, timestamps, statuses) stays in the sans/mono UI type.
// Add to index.html:
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet">
const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

function formatDateTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function toDatetimeLocal(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [scheduleTarget, setScheduleTarget] = useState<Appointment | null>(null);
  const [scheduleValue, setScheduleValue] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});

  const active = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "pending" || a.status === "scheduled")
        .sort((a, b) => (a.status === "pending" ? -1 : 1)),
    [appointments]
  );
  const completed = useMemo(
    () => appointments.filter((a) => a.status === "completed"),
    [appointments]
  );

  function openSchedule(appointment: Appointment) {
    setScheduleTarget(appointment);
    setScheduleValue(toDatetimeLocal(appointment.scheduledAt));
  }

  function confirmSchedule() {
    if (!scheduleTarget || !scheduleValue) return;
    const iso = new Date(scheduleValue).toISOString();
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === scheduleTarget.id ? { ...a, status: "scheduled", scheduledAt: iso } : a
      )
    );
    setScheduleTarget(null);
  }

  function saveReview(appointmentId: string) {
    const text = reviewDrafts[appointmentId];
    if (text === undefined) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, review: text } : a))
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Appointments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review counselling applications and manage session notes.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active applications
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {active.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed sessions
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {completed.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE */}
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {active.map((appointment) => {
              const student = studentOf(appointment.studentId);
              const institution = institutionOf(student.institutionId);
              return (
                <Card
                  key={appointment.id}
                  className="border-neutral-200 shadow-none"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className="text-lg font-medium text-neutral-900"
                          style={nameFont}
                        >
                          {student.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                          <Building2 className="h-3.5 w-3.5" />
                          {institution.name}
                        </div>
                      </div>
                      {appointment.status === "pending" ? (
                        <Badge className="border-none bg-[#F3E4C9] text-[#7A5A17] hover:bg-[#F3E4C9]">
                          Awaiting a time
                        </Badge>
                      ) : (
                        <Badge className="border-none bg-[#EDF2EF] text-[#3F5A4E] hover:bg-[#EDF2EF]">
                          Scheduled
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    <div className="rounded-lg border-l-2 border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm leading-relaxed text-neutral-700">
                      {appointment.reason}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Requested {timeAgo(appointment.requestedAt)}
                    </div>
                    {appointment.status === "scheduled" && appointment.scheduledAt && (
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#3F5A4E]">
                        <CalendarClock className="h-4 w-4" />
                        {formatDateTime(appointment.scheduledAt)}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex gap-2 pt-0">
                    <Button variant="outline" className="flex-1 gap-1.5" asChild>
                      <a href="/chat">
                        <MessageSquare className="h-4 w-4" />
                        Open chat
                      </a>
                    </Button>
                    <Button
                      className="flex-1 gap-1.5 bg-neutral-900 hover:bg-neutral-800"
                      onClick={() => openSchedule(appointment)}
                    >
                      <CalendarClock className="h-4 w-4" />
                      {appointment.status === "scheduled" ? "Reschedule" : "Schedule"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* COMPLETED */}
        <TabsContent value="completed" className="mt-0">
          <div className="flex flex-col gap-4">
            {completed.map((appointment) => {
              const student = studentOf(appointment.studentId);
              const institution = institutionOf(student.institutionId);
              const draft = reviewDrafts[appointment.id] ?? appointment.review ?? "";
              const dirty = draft !== (appointment.review ?? "");
              return (
                <Card key={appointment.id} className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className="text-lg font-medium text-neutral-900"
                          style={nameFont}
                        >
                          {student.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />
                            {institution.name}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {formatDateTime(appointment.sessionAt)}
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
                      <span className="font-medium text-neutral-600">Reason: </span>
                      {appointment.reason}
                    </p>

                    <div>
                      <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                        <PenLine className="h-3.5 w-3.5" />
                        Session review
                      </Label>
                      <Textarea
                        value={draft}
                        onChange={(e) =>
                          setReviewDrafts((prev) => ({
                            ...prev,
                            [appointment.id]: e.target.value,
                          }))
                        }
                        placeholder="Summarize how the session went, any concerns, and follow-up plans..."
                        className="min-h-[96px] resize-none text-sm"
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="justify-end pt-0">
                    <Button
                      size="sm"
                      disabled={!dirty}
                      onClick={() => saveReview(appointment.id)}
                      className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40"
                    >
                      {appointment.review ? "Update review" : "Save review"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Schedule dialog */}
      <Dialog open={!!scheduleTarget} onOpenChange={(open) => !open && setScheduleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={nameFont} className="text-xl font-medium">
              {scheduleTarget && `Schedule with ${studentOf(scheduleTarget.studentId).name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="schedule-time">Session date & time</Label>
            <Input
              id="schedule-time"
              type="datetime-local"
              value={scheduleValue}
              onChange={(e) => setScheduleValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-neutral-900 hover:bg-neutral-800"
              onClick={confirmSchedule}
              disabled={!scheduleValue}
            >
              Confirm time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}