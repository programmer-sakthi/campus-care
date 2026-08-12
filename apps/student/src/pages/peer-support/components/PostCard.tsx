import { Card } from "@repo/ui/components/card";
import { MessageCircle } from "lucide-react";
import { AnonymousIdentity } from "./AnonymousIdentity";
import { VoteControl } from "./VoteControl";
import { formatRelativeTime } from "../utils/formatTime";
import type { Post, Topic, VoteDirection } from "../types/peerSupport";

interface PostCardProps {
  post: Post;
  topic: Topic | undefined;
  userVote?: VoteDirection;
  onVote: (direction: VoteDirection) => void;
  onOpen: () => void;
}

export function PostCard({ post, topic, userVote, onVote, onOpen }: PostCardProps) {
  return (
    <Card className="rounded-xl border-border p-4 transition-colors hover:border-emerald-200">
      <div className="flex items-start justify-between gap-3">
        <AnonymousIdentity user={post.author} timestamp={formatRelativeTime(post.createdAt)} />
        {topic && (
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {topic.name}
          </span>
        )}
      </div>

      <button type="button" onClick={onOpen} className="mt-3 block w-full text-left">
        <h2 className="text-base font-semibold text-foreground">{post.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
      </button>

      <div className="mt-3 flex items-center gap-4">
        <VoteControl upvotes={post.upvotes} downvotes={post.downvotes} userVote={userVote} onVote={onVote} size="sm" />
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <MessageCircle size={16} />
          {post.commentCount}
        </button>
      </div>
    </Card>
  );
}