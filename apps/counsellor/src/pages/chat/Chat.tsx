import { useMemo, useState } from "react";
import { Search, Send, Building2, CalendarClock } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Badge } from "@repo/ui/components/badge";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  appointments,
  conversations as initialConversations,
  institutionOf,
  students,
  type Message,
} from "./mock-data.ts";


// NOTE ON TYPE: add Fraunces to your project (e.g. in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet">
// Every person's name in this app renders in Fraunces — everything the
// system generates (labels, timestamps, statuses) stays in the sans/mono UI type.
const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Chat() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(students[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const rows = useMemo(() => {
    return students
      .map((student) => {
        const thread = conversations[student.id] ?? [];
        const last = thread[thread.length - 1];
        const appointment = appointments.find((a) => a.studentId === student.id);
        return { student, last, appointment };
      })
      .filter(({ student }) =>
        student.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const ta = a.last ? new Date(a.last.time).getTime() : 0;
        const tb = b.last ? new Date(b.last.time).getTime() : 0;
        return tb - ta;
      });
  }, [conversations, query]);

  const selectedStudent = students.find((s) => s.id === selectedId)!;
  const selectedInstitution = institutionOf(selectedStudent.institutionId);
  const selectedAppointment = appointments.find((a) => a.studentId === selectedId);
  const thread = conversations[selectedId] ?? [];

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const message: Message = {
      id: `m-${Date.now()}`,
      sender: "counsellor",
      text,
      time: new Date().toISOString(),
    };
    setConversations((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), message],
    }));
    setDraft("");
  }

  return (
    <div className="mx-auto flex h-screen max-w-6xl gap-0 px-4 pb-6 pt-28">
      {/* Conversation list */}
      <aside className="flex w-[320px] shrink-0 flex-col rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-4">
          <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
            Conversations
          </h1>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students"
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {rows.map(({ student, last, appointment }) => {
              const institution = institutionOf(student.institutionId);
              const active = student.id === selectedId;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedId(student.id)}
                  className={[
                    "flex items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors",
                    active ? "bg-neutral-50" : "hover:bg-neutral-50/60",
                  ].join(" ")}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className="truncate text-[15px] font-medium text-neutral-900"
                        style={nameFont}
                      >
                        {student.name}
                      </span>
                      {last && (
                        <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                          {formatClock(last.time)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {institution.shortName}
                    </p>
                    {last && (
                      <p className="mt-1 truncate text-sm text-neutral-500">
                        {last.sender === "counsellor" ? "You: " : ""}
                        {last.text}
                      </p>
                    )}
                    {appointment?.status === "pending" && (
                      <Badge className="mt-1.5 border-none bg-[#F3E4C9] text-[10px] font-medium text-[#7A5A17] hover:bg-[#F3E4C9]">
                        Needs scheduling
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Thread */}
      <section className="flex flex-1 flex-col rounded-2xl border border-neutral-200 bg-white ml-4">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
                {selectedStudent.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-medium text-neutral-900" style={nameFont}>
                {selectedStudent.name}
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                <Building2 className="h-3.5 w-3.5" />
                {selectedInstitution.name}
              </div>
            </div>
          </div>
          {selectedAppointment && (
            <Badge
              variant="outline"
              className={[
                "gap-1.5 border-neutral-200 text-xs font-medium",
                selectedAppointment.status === "scheduled" && "text-[#3F5A4E]",
                selectedAppointment.status === "pending" && "text-[#7A5A17]",
                selectedAppointment.status === "completed" && "text-neutral-500",
              ].join(" ")}
            >
              <CalendarClock className="h-3.5 w-3.5" />
              {selectedAppointment.status === "scheduled" && selectedAppointment.scheduledAt
                ? `Scheduled · ${formatTime(selectedAppointment.scheduledAt)}`
                : selectedAppointment.status === "pending"
                ? "Awaiting a time"
                : "Session completed"}
            </Badge>
          )}
        </header>

        {selectedAppointment && (
          <div className="border-b border-neutral-100 bg-neutral-50/60 px-6 py-2.5 text-sm text-neutral-600">
            <span className="font-medium text-neutral-700">Reason for applying: </span>
            {selectedAppointment.reason}
          </div>
        )}

        <ScrollArea className="flex-1 px-6 py-5">
          <div className="flex flex-col gap-4">
            {thread.map((message) => (
              <div
                key={message.id}
                className={[
                  "flex flex-col",
                  message.sender === "counsellor" ? "items-end" : "items-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    message.sender === "counsellor"
                      ? "rounded-br-sm bg-neutral-900 text-white"
                      : "rounded-bl-sm bg-neutral-100 text-neutral-800",
                  ].join(" ")}
                >
                  {message.text}
                </div>
                <span className="mt-1 font-mono text-[10px] text-neutral-400">
                  {formatTime(message.time)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 border-t border-neutral-200 p-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Message ${selectedStudent.name.split(" ")[0]}...`}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-neutral-900 hover:bg-neutral-800">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}