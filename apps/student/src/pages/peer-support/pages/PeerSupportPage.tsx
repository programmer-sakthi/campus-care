import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ForumHeader } from "../components/ForumHeader";
import { TopicSidebar } from "../components/TopicSidebar";
import { TopicSelector } from "../components/TopicSelector";
import { PostList } from "../components/PostList";
import { PostComposer } from "../components/PostComposer";
import { ALL_TOPICS_ID } from "../types/peerSupport";
import type { PeerSupportContextValue } from "../types/peerSupport";

export function PeerSupportPage({ posts, topics, currentUser, postVotes, addPost, votePost }: PeerSupportContextValue) {
  const navigate = useNavigate();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_TOPICS_ID);
  const [composerOpen, setComposerOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    if (selectedTopicId === ALL_TOPICS_ID) return posts;
    return posts.filter((post) => post.topicId === selectedTopicId);
  }, [posts, selectedTopicId]);

  return (
    <div className="flex flex-col gap-6">
      <ForumHeader onCreatePost={() => setComposerOpen(true)} />

      <TopicSelector topics={topics} selectedTopicId={selectedTopicId} onSelectTopic={setSelectedTopicId} />

      <div className="flex gap-6">
        <TopicSidebar topics={topics} selectedTopicId={selectedTopicId} onSelectTopic={setSelectedTopicId} />

        <div className="min-w-0 flex-1">
          <PostList
            posts={filteredPosts}
            topics={topics}
            postVotes={postVotes}
            onVote={votePost}
            onOpenPost={(postId) => navigate(`/peer-support/post/${postId}`)}
          />
        </div>
      </div>

      <PostComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        topics={topics}
        currentUser={currentUser}
        onSubmit={(topicId, title, content) => addPost(topicId, title, content)}
      />
    </div>
  );
}