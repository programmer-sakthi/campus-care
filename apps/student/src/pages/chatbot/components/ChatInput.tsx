import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

interface ChatInputProps {
  disabled?: boolean;
  onSend: (content: string) => void;
}

export default function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <div className="flex items-center gap-2 border-t border-neutral-200 p-4">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Message Emora..."
        disabled={disabled}
        className="flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !draft.trim()}
        size="icon"
        className="bg-neutral-900 hover:bg-neutral-800"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
