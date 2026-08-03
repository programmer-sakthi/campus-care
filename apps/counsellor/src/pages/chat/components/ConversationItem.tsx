import { Button } from "@repo/ui/components/button";
import { getInitials } from "../utils/inititals";
import { formatConversationTime } from "../utils/format-time";
import type { Conversation } from "../types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 px-4 py-3 hover:bg-neutral-100 ${isActive ? "bg-neutral-100 hover:bg-neutral-100" : ""}`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-700">
        {getInitials(conversation.name)}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span className="truncate text-sm font-medium text-neutral-900">
          {conversation.name}
        </span>
        <span className="truncate text-xs text-neutral-500">
          {conversation.lastMessage}
        </span>
      </div>
      <span className="shrink-0 text-xs text-neutral-400">
        {formatConversationTime(conversation.lastMessageTime)}
      </span>
    </Button>
  );
}