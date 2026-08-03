import { formatMessageTime } from "../utils/format-time";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-neutral-900 text-neutral-50"
            : "bg-neutral-100 text-neutral-900"
        }`}
      >
        <p>{message.text}</p>
        <span
          className={`mt-1 block text-[11px] ${isUser ? "text-neutral-400" : "text-neutral-500"}`}
        >
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}