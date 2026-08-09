import { Button } from "@repo/ui/components/button";
import { ALL_TOPICS_ID } from "../types/peerSupport";
import type { Topic } from "../types/peerSupport";

interface TopicSidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

export function TopicSidebar({ topics, selectedTopicId, onSelectTopic }: TopicSidebarProps) {
  return (
    <nav aria-label="Topics" className="hidden w-48 shrink-0 flex-col gap-1 md:flex">
      <TopicButton
        label="All posts"
        active={selectedTopicId === ALL_TOPICS_ID}
        onClick={() => onSelectTopic(ALL_TOPICS_ID)}
      />
      {topics.map((topic) => (
        <TopicButton
          key={topic.id}
          label={topic.name}
          active={selectedTopicId === topic.id}
          onClick={() => onSelectTopic(topic.id)}
        />
      ))}
    </nav>
  );
}

interface TopicButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function TopicButton({ label, active, onClick }: TopicButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`justify-start rounded-lg px-3 text-sm font-normal ${
        active ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-50" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </Button>
  );
}