import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { AnonymousIdentity } from "../components/AnonymousIdentity";
import { VoteControl } from "../components/VoteControl";
import { CommentList } from "../components/CommentList";
import { CommentComposer } from "../components/CommentComposer";
import { formatRelativeTime } from "../utils/formatTime";
import type { PeerSupportContextValue } from "../types/peerSupport";

export function PostDetailsPage({
  posts,
  comments,
  topics,
  postVotes,
  commentVotes,
  votePost,
  voteComment,
  addComment,
}: PeerSupportContextValue) {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const post = posts.find((item) => item.id === postId);
  const postComments = comments.filter((comment) => comment.postId === postId);
  const topic = topics.find((item) => item.id === post?.topicId);

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">This post couldn&apos;t be found.</p>
        <Button type="button" variant="secondary" onClick={() => navigate("/peer-support")}>
          Back to Peer Support
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/peer-support"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Peer Support
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3">
          <AnonymousIdentity user={post.author} timestamp={formatRelativeTime(post.createdAt)} />
          {topic && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {topic.name}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-xl font-semibold text-foreground">{post.title}</h1>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">{post.content}</p>

        <div className="mt-4">
          <VoteControl
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={postVotes[post.id]}
            onVote={(direction) => votePost(post.id, direction)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="mb-1 text-sm font-medium text-foreground">
          {postComments.length} {postComments.length === 1 ? "Comment" : "Comments"}
        </h2>
        <CommentList
          comments={postComments}
          commentVotes={commentVotes}
          onVote={(commentId, direction) => voteComment(commentId, direction)}
        />
      </div>

      <Separator />

      <CommentComposer onSubmit={(content) => addComment(post.id, content)} />
    </div>
  );
}