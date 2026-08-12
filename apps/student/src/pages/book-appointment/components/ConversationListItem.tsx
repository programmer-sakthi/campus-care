import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import type { Application, Counsellor, Message } from "../types";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { formatClock } from "../utils/format";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface ConversationListItemProps {
  counsellor: Counsellor;
  application: Application;
  lastMessage?: Message;
  active: boolean;
  onSelect: () => void;
}

export function ConversationListItem({
  counsellor,
  application,
  lastMessage,
  active,
  onSelect,
}: ConversationListItemProps) {
  return (
    <button
      onClick={onSelect}
      className={[
        "flex w-full items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors",
        active ? "bg-neutral-50" : "hover:bg-neutral-50/60",
      ].join(" ")}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
          {counsellor.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px] font-medium text-neutral-900" style={nameFont}>
            {counsellor.name}
          </span>
          {lastMessage && (
            <span className="shrink-0 font-mono text-[11px] text-neutral-400">
              {formatClock(lastMessage.time)}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="mt-1 truncate text-sm text-neutral-500">
            {lastMessage.sender === "student" ? "You: " : ""}
            {lastMessage.text}
          </p>
        )}
        <div className="mt-1.5">
          <ApplicationStatusBadge status={application.status} />
        </div>
      </div>
    </button>
  );
}