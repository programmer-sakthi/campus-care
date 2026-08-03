import { Separator } from "@repo/ui/components/separator";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="flex w-80 flex-col border-r border-neutral-200 bg-white/50">
      <div className="px-5 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">Conversations</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}