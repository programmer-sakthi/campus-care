import { Button } from "@repo/ui/components/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import type { VoteDirection } from "../types/peerSupport";

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
  userVote?: VoteDirection;
  onVote: (direction: VoteDirection) => void;
  size?: "sm" | "default";
}

export function VoteControl({ upvotes, downvotes, userVote, onVote, size = "default" }: VoteControlProps) {
  const iconSize = size === "sm" ? 16 : 18;
  const score = upvotes - downvotes;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Vote on this post">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-7 w-7 ${userVote === "up" ? "text-emerald-600" : "text-muted-foreground"}`}
        aria-label="Upvote"
        aria-pressed={userVote === "up"}
        onClick={() => onVote("up")}
      >
        <ArrowBigUp size={iconSize} fill={userVote === "up" ? "currentColor" : "none"} />
      </Button>
      <span className="min-w-[1.5rem] text-center text-sm font-medium text-foreground">{score}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-7 w-7 ${userVote === "down" ? "text-rose-500" : "text-muted-foreground"}`}
        aria-label="Downvote"
        aria-pressed={userVote === "down"}
        onClick={() => onVote("down")}
      >
        <ArrowBigDown size={iconSize} fill={userVote === "down" ? "currentColor" : "none"} />
      </Button>
    </div>
  );
}