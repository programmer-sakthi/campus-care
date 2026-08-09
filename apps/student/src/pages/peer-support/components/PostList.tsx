import { PostCard } from "./PostCard";
import { EmptyState } from "./EmptyState";
import type { Post, Topic, VoteDirection, VoteMap } from "../types/peerSupport";

interface PostListProps {
  posts: Post[];
  topics: Topic[];
  postVotes: VoteMap;
  onVote: (postId: string, direction: VoteDirection) => void;
  onOpenPost: (postId: string) => void;
}

export function PostList({ posts, topics, postVotes, onVote, onOpenPost }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState title="No posts here yet" description="Be the first to share something in this topic." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          topic={topics.find((topic) => topic.id === post.topicId)}
          userVote={postVotes[post.id]}
          onVote={(direction) => onVote(post.id, direction)}
          onOpen={() => onOpenPost(post.id)}
        />
      ))}
    </div>
  );
}