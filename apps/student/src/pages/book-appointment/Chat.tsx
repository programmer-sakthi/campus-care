import { useMemo, useState } from "react";
import { Building2, CalendarClock, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { ConversationListItem } from "./components/ConversationListItem";
import { MessageBubble } from "./components/MessageBubble";
import { counsellors } from "./mockdata/counsellors";
import { initialApplications } from "./mockdata/applications";
import { initialConversations } from "./mockdata/conversations";
import { currentStudent } from "./mockdata/profile";
import { formatDateTime } from "./utils/format";
import type { Application, Message } from "./types";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface ChatProps {
  /** Application id to open initially, e.g. handed off from the booking page */
  initialApplicationId?: string;
}

export default function Chat({ initialApplicationId }: ChatProps) {
  const [applications] = useState<Application[]>(initialApplications);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    initialConversations
  );
  const [selectedId, setSelectedId] = useState(
    initialApplicationId ?? applications[0]?.id
  );
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const rows = useMemo(() => {
    return applications
      .map((application) => {
        const counsellor = counsellors.find((c) => c.id === application.counsellorId)!;
        const thread = conversations[application.id] ?? [];
        const last = thread[thread.length - 1];
        return { application, counsellor, last };
      })
      .filter(({ counsellor }) =>
        counsellor.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const ta = a.last ? new Date(a.last.time).getTime() : 0;
        const tb = b.last ? new Date(b.last.time).getTime() : 0;
        return tb - ta;
      });
  }, [applications, conversations, query]);

  const selectedApplication = applications.find((a) => a.id === selectedId);
  const selectedCounsellor = selectedApplication
    ? counsellors.find((c) => c.id === selectedApplication.counsellorId)!
    : undefined;
  const thread = selectedId ? conversations[selectedId] ?? [] : [];

  function handleSend() {
    const text = draft.trim();
    if (!text || !selectedId) return;
    const message: Message = {
      id: `m-${Date.now()}`,
      sender: "student",
      text,
      time: new Date().toISOString(),
    };
    setConversations((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), message],
    }));
    setDraft("");
  }

  if (!selectedApplication || !selectedCounsellor) {
    return (
      <div className="mx-auto flex h-screen max-w-6xl items-center justify-center px-4 pt-28 text-sm text-neutral-500">
        You don't have any active conversations yet — request a session with a counsellor
        to start one.
      </div>
    );
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
              placeholder="Search counsellors"
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {rows.map(({ application, counsellor, last }) => (
              <ConversationListItem
                key={application.id}
                counsellor={counsellor}
                application={application}
                lastMessage={last}
                active={application.id === selectedId}
                onSelect={() => setSelectedId(application.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Thread */}
      <section className="ml-4 flex flex-1 flex-col rounded-2xl border border-neutral-200 bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
                {selectedCounsellor.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-medium text-neutral-900" style={nameFont}>
                {selectedCounsellor.name}
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                <Building2 className="h-3.5 w-3.5" />
                {currentStudent.institutionName}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={[
              "gap-1.5 border-neutral-200 text-xs font-medium",
              selectedApplication.status === "scheduled" && "text-[#3F5A4E]",
              selectedApplication.status === "pending" && "text-[#7A5A17]",
              selectedApplication.status === "completed" && "text-neutral-500",
            ].join(" ")}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {selectedApplication.status === "scheduled" && selectedApplication.scheduledAt
              ? `Scheduled · ${formatDateTime(selectedApplication.scheduledAt)}`
              : selectedApplication.status === "pending"
              ? "Awaiting a time"
              : "Session completed"}
          </Badge>
        </header>

        <div className="border-b border-neutral-100 bg-neutral-50/60 px-6 py-2.5 text-sm text-neutral-600">
          <span className="font-medium text-neutral-700">Your reason: </span>
          {selectedApplication.reason}
        </div>

        <ScrollArea className="flex-1 px-6 py-5">
          <div className="flex flex-col gap-4">
            {thread.map((message) => (
              <MessageBubble key={message.id} message={message} />
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
            placeholder={`Message ${selectedCounsellor.name.split(" ")[1] ?? selectedCounsellor.name}...`}
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