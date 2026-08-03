import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  return (
    <div className="border-t border-neutral-200 bg-white/70 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-xl">
        <Input
          type="text"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
          className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0"
        />
        <Button
          size="sm"
          className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-800"
          onClick={onSend}
          disabled={disabled || !value.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}