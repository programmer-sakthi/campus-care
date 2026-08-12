export type UserRole = "Student" | "Peer";

export interface AnonymousUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  author: AnonymousUser;
  topicId: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: AnonymousUser;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export type VoteDirection = "up" | "down";

export type VoteMap = Record<string, VoteDirection | undefined>;

export const ALL_TOPICS_ID = "all";

export interface PeerSupportContextValue {
  posts: Post[];
  comments: Comment[];
  topics: Topic[];
  currentUser: AnonymousUser;
  postVotes: VoteMap;
  commentVotes: VoteMap;
  addPost: (topicId: string, title: string, content: string) => Post;
  addComment: (postId: string, content: string) => Comment;
  votePost: (postId: string, direction: VoteDirection) => void;
  voteComment: (commentId: string, direction: VoteDirection) => void;
}