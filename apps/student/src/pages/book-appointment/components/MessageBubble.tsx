import type { Message } from "../types";
import { formatDateTime } from "../utils/format";

export function MessageBubble({ message }: { message: Message }) {
  const isStudent = message.sender === "student";
  return (
    <div className={["flex flex-col", isStudent ? "items-end" : "items-start"].join(" ")}>
      <div
        className={[
          "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isStudent
            ? "rounded-br-sm bg-neutral-900 text-white"
            : "rounded-bl-sm bg-neutral-100 text-neutral-800",
        ].join(" ")}
      >
        {message.text}
      </div>
      <span className="mt-1 font-mono text-[10px] text-neutral-400">
        {formatDateTime(message.time)}
      </span>
    </div>
  );
}