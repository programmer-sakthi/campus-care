import { Button } from "@repo/ui/components/button";
import { AnonymousIdentity } from "./AnonymousIdentity";
import { VoteControl } from "./VoteControl";
import { formatRelativeTime } from "../utils/formatTime";
import type { Comment, VoteDirection } from "../types/peerSupport";

interface CommentCardProps {
  comment: Comment;
  userVote?: VoteDirection;
  onVote: (direction: VoteDirection) => void;
}

export function CommentCard({ comment, userVote, onVote }: CommentCardProps) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <AnonymousIdentity user={comment.author} timestamp={formatRelativeTime(comment.createdAt)} size="sm" />
      <p className="mt-2 text-sm text-foreground">{comment.content}</p>
      <div className="mt-2 flex items-center gap-3">
        <VoteControl
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          userVote={userVote}
          onVote={onVote}
          size="sm"
        />
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
          Reply
        </Button>
      </div>
    </div>
  );
}