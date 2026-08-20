import { Plus, Sparkles } from "lucide-react";
import { Button } from "@repo/ui/components/button";

import type { ChatbotChat } from "../types";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface ChatHeaderProps {
  chats: ChatbotChat[];
  activeChatId?: string;
  isCreating?: boolean;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatHeader({
  chats,
  activeChatId,
  isCreating,
  onSelectChat,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header className="border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF2EF] text-[#3F5A4E]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-medium text-neutral-900" style={nameFont}>
            Emora
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">Your AI mental health companion</p>
        </div>
        <Button size="sm" variant="outline" onClick={onNewChat} disabled={isCreating}>
          <Plus className="mr-1 h-4 w-4" /> New chat
        </Button>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
        {chats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelectChat(chat.id)}
            className={[
              "shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
              chat.id === activeChatId
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            ].join(" ")}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </header>
  );
}
