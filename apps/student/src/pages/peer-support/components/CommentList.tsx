import { CommentCard } from "./CommentCard";
import { EmptyState } from "./EmptyState";
import type { Comment, VoteDirection, VoteMap } from "../types/peerSupport";

interface CommentListProps {
  comments: Comment[];
  commentVotes: VoteMap;
  onVote: (commentId: string, direction: VoteDirection) => void;
}

export function CommentList({ comments, commentVotes, onVote }: CommentListProps) {
  if (comments.length === 0) {
    return <EmptyState title="No comments yet" description="Be the first to respond with something supportive." />;
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          userVote={commentVotes[comment.id]}
          onVote={(direction) => onVote(comment.id, direction)}
        />
      ))}
    </div>
  );
}