import { useEffect, useMemo, useRef, useState } from "react";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { Building2, Search, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { trpc } from "../../lib/trpc";
import { getSession } from "../../lib/auth";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initialsOf(nameOrEmail: string) {
  return nameOrEmail.trim().slice(0, 2).toUpperCase();
}

interface ChatProps {
  /** Conversation id to open initially, e.g. handed off from the booking page */
  initialConversationId?: string;
}

export default function Chat({ initialConversationId }: ChatProps) {
  const token = getSession()?.token;

  const conversationsQuery = useQuery(trpc.chat.conversations.queryOptions());
  const conversations = conversationsQuery.data ?? [];

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(initialConversationId);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default to the most recently active conversation once the list loads.
  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0]!.id);
    }
  }, [conversations, selectedId]);

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        (c.counsellor.name ?? c.counsellor.email).toLowerCase().includes(query.toLowerCase()),
      ),
    [conversations, query],
  );

  // Message history for the open conversation.
  const messagesQuery = useQuery(
    trpc.chat.messages.queryOptions(
      selectedId ? { conversationId: selectedId, limit: 50 } : skipToken,
    ),
  );

  type ChatMessage = { id: string; senderType: "STUDENT" | "COUNSELLOR"; content: string; createdAt: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages(messagesQuery.data?.messages ?? []);
  }, [messagesQuery.data, selectedId]);

  // Live updates: keeps `messages` current, including the copy the student
  // themselves just sent (the server echoes every message back to every
  // subscriber of that conversation).
  useSubscription(
    trpc.chat.onMessage.subscriptionOptions(
      selectedId && token ? { conversationId: selectedId, token, lastEventId: null } : skipToken,
      {
        onData: (event) => {
          const message = event.data as ChatMessage;
          setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
        },
        onError: (err) => console.error("Chat subscription error:", err),
      },
    ),
  );

  const sendMessage = useMutation(trpc.chat.sendMessage.mutationOptions());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, selectedId]);

  function handleSend() {
    const text = draft.trim();
    if (!text || !selectedId) return;
    sendMessage.mutate({ conversationId: selectedId, content: text });
    setDraft("");
  }

  if (!selected) {
    return (
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 pt-28 text-sm text-neutral-500">
        You don't have any active conversations yet — request a session with a counsellor
        to start one.
      </div>
    );
  }

  const counsellorName = selected.counsellor.name ?? selected.counsellor.email;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-0 px-4 pb-6 pt-12">
      {/* Conversation list */}
      <aside className="flex min-h-0 w-[320px] shrink-0 flex-col rounded-2xl border border-neutral-200 bg-white">
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
            {filtered.map((c) => {
              const last = c.messages[0];
              const name = c.counsellor.name ?? c.counsellor.email;
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={[
                    "flex w-full items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors",
                    active ? "bg-neutral-50" : "hover:bg-neutral-50/60",
                  ].join(" ")}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
                      {initialsOf(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[15px] font-medium text-neutral-900" style={nameFont}>
                        {name}
                      </span>
                      {last && (
                        <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                          {formatClock(last.createdAt)}
                        </span>
                      )}
                    </div>
                    {last && (
                      <p className="mt-1 truncate text-sm text-neutral-500">
                        {last.senderType === "STUDENT" ? "You: " : ""}
                        {last.content}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Thread */}
      <section className="ml-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
                {initialsOf(counsellorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-medium text-neutral-900" style={nameFont}>
                {counsellorName}
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                <Building2 className="h-3.5 w-3.5" />
                Counsellor
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            {messages.map((message) => {
              const isStudent = message.senderType === "STUDENT";
              return (
                <div key={message.id} className={["flex flex-col", isStudent ? "items-end" : "items-start"].join(" ")}>
                  <div
                    className={[
                      "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      isStudent
                        ? "rounded-br-sm bg-neutral-900 text-white"
                        : "rounded-bl-sm bg-neutral-100 text-neutral-800",
                    ].join(" ")}
                  >
                    {message.content}
                  </div>
                  <span className="mt-1 font-mono text-[10px] text-neutral-400">
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-200 p-4">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Message ${counsellorName.split(" ")[0]}...`}
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