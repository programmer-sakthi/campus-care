import { MessageBubble } from "./MessageBubble";
import type { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  conversationName: string;
}

export function ChatWindow({ messages, conversationName }: ChatWindowProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-neutral-200 bg-white/70 px-6 py-4 backdrop-blur">
        <h3 className="text-base font-semibold text-neutral-900">
          {conversationName}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-neutral-400">
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}