import { HeartHandshake } from "lucide-react";

import type { ChatbotMessage } from "../types";
import { formatClock } from "../utils/format";

export default function MessageBubble({ message }: { message: ChatbotMessage }) {
  const isStudent = message.role === "USER";
  const flagged = message.riskLevel === "HIGH" || message.riskLevel === "CRITICAL";

  return (
    <div className={["flex flex-col", isStudent ? "items-end" : "items-start"].join(" ")}>
      <div
        className={[
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isStudent
            ? "rounded-br-sm bg-neutral-900 text-white"
            : flagged
              ? "rounded-bl-sm border border-amber-200 bg-amber-50 text-neutral-800"
              : "rounded-bl-sm bg-neutral-100 text-neutral-800",
        ].join(" ")}
      >
        {!isStudent && flagged && (
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <HeartHandshake className="h-3.5 w-3.5" />
            Emora wants to check in
          </div>
        )}
        {message.content}
      </div>
      <span className="mt-1 font-mono text-[10px] text-neutral-400">
        {formatClock(message.createdAt)}
      </span>
    </div>
  );
}
