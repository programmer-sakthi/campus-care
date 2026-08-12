import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { ALL_TOPICS_ID } from "../types/peerSupport";
import type { Topic } from "../types/peerSupport";

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

export function TopicSelector({ topics, selectedTopicId, onSelectTopic }: TopicSelectorProps) {
  const options = [{ id: ALL_TOPICS_ID, name: "All" }, ...topics];

  return (
    <div className="md:hidden">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3" role="tablist" aria-label="Topics">
          {options.map((topic) => {
            const active = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectTopic(topic.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {topic.name}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}