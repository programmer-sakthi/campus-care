import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { PeerSupportPage } from "./pages/PeerSupportPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { mockPosts } from "./mockdata/posts";
import { mockComments } from "./mockdata/comments";
import { mockTopics } from "./mockdata/topics";
import { generateAnonymousUser } from "./utils/generateUsername";
import type { Comment, PeerSupportContextValue, Post, VoteDirection, VoteMap } from "./types/peerSupport";

let nextPostId = mockPosts.length + 1;
let nextCommentId = mockComments.length + 1;

interface VoteResult {
  upvotes: number;
  downvotes: number;
  vote: VoteDirection | undefined;
}

function applyVote(
  currentVote: VoteDirection | undefined,
  nextVote: VoteDirection,
  upvotes: number,
  downvotes: number,
): VoteResult {
  if (currentVote === nextVote) {
    return {
      upvotes: nextVote === "up" ? upvotes - 1 : upvotes,
      downvotes: nextVote === "down" ? downvotes - 1 : downvotes,
      vote: undefined,
    };
  }

  let nextUpvotes = upvotes;
  let nextDownvotes = downvotes;
  if (currentVote === "up") nextUpvotes -= 1;
  if (currentVote === "down") nextDownvotes -= 1;
  if (nextVote === "up") nextUpvotes += 1;
  if (nextVote === "down") nextDownvotes += 1;

  return { upvotes: nextUpvotes, downvotes: nextDownvotes, vote: nextVote };
}

/**
 * Single entry point for the Peer Support feature.
 *
 * Mount this component at both of your existing routes:
 *   /peer-support                -> <PeerSupport />
 *   /peer-support/post/:postId   -> <PeerSupport />
 *
 * It owns all mock state (posts, comments, votes, anonymous identity)
 * and switches between the feed and the post-detail view depending on
 * whether a :postId route param is present — no extra providers or
 * nested routes needed on your end.
 */
export default function PeerSupport() {
  const { postId } = useParams<{ postId?: string }>();

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [postVotes, setPostVotes] = useState<VoteMap>({});
  const [commentVotes, setCommentVotes] = useState<VoteMap>({});
  const [currentUser] = useState(() => generateAnonymousUser());

  const addPost = (topicId: string, title: string, content: string): Post => {
    const newPost: Post = {
      id: `p${nextPostId++}`,
      author: currentUser,
      topicId,
      title,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
    };
    setPosts((previous) => [newPost, ...previous]);
    return newPost;
  };

  const addComment = (targetPostId: string, content: string): Comment => {
    const newComment: Comment = {
      id: `c${nextCommentId++}`,
      postId: targetPostId,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    setComments((previous) => [...previous, newComment]);
    setPosts((previous) =>
      previous.map((post) => (post.id === targetPostId ? { ...post, commentCount: post.commentCount + 1 } : post)),
    );
    return newComment;
  };

  const votePost = (targetPostId: string, direction: VoteDirection) => {
    const post = posts.find((item) => item.id === targetPostId);
    if (!post) return;
    const result = applyVote(postVotes[targetPostId], direction, post.upvotes, post.downvotes);
    setPosts((previous) =>
      previous.map((item) =>
        item.id === targetPostId ? { ...item, upvotes: result.upvotes, downvotes: result.downvotes } : item,
      ),
    );
    setPostVotes((votes) => ({ ...votes, [targetPostId]: result.vote }));
  };

  const voteComment = (commentId: string, direction: VoteDirection) => {
    const comment = comments.find((item) => item.id === commentId);
    if (!comment) return;
    const result = applyVote(commentVotes[commentId], direction, comment.upvotes, comment.downvotes);
    setComments((previous) =>
      previous.map((item) =>
        item.id === commentId ? { ...item, upvotes: result.upvotes, downvotes: result.downvotes } : item,
      ),
    );
    setCommentVotes((votes) => ({ ...votes, [commentId]: result.vote }));
  };

  const value: PeerSupportContextValue = useMemo(
    () => ({
      posts,
      comments,
      topics: mockTopics,
      currentUser,
      postVotes,
      commentVotes,
      addPost,
      addComment,
      votePost,
      voteComment,
    }),
    [posts, comments, currentUser, postVotes, commentVotes],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {postId ? <PostDetailsPage {...value} /> : <PeerSupportPage {...value} />}
    </div>
  );
} 