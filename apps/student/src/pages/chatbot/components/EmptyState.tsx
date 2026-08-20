import { Sparkles } from "lucide-react";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF2EF] text-[#3F5A4E]">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-neutral-900" style={nameFont}>
        Hey, I'm Emora
      </h3>
      <p className="max-w-sm text-sm text-neutral-500">
        I'm here to listen, anytime. Tell me what's on your mind — stress, sleep,
        relationships, anything. I'll remember what matters to keep supporting you
        over time.
      </p>
    </div>
  );
}
