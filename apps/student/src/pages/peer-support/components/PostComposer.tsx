import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select";
import { AnonymousIdentity } from "./AnonymousIdentity";
import type { AnonymousUser, Topic } from "../types/peerSupport";

interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topics: Topic[];
  currentUser: AnonymousUser;
  onSubmit: (topicId: string, title: string, content: string) => void;
}

export function PostComposer({ open, onOpenChange, topics, currentUser, onSubmit }: PostComposerProps) {
  const [topicId, setTopicId] = useState<string>(topics[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit = topicId.length > 0 && title.trim().length > 0 && content.trim().length > 0;

  const resetAndClose = () => {
    setTitle("");
    setContent("");
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(topicId, title.trim(), content.trim());
    resetAndClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="post-topic" className="text-sm font-medium text-foreground">
              Topic
            </label>
            <Select value={topicId} onValueChange={setTopicId}>
              <SelectTrigger id="post-topic">
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="post-title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              id="post-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What's this about?"
              maxLength={120}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="post-content" className="text-sm font-medium text-foreground">
              What&apos;s on your mind?
            </label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Share as much or as little as feels comfortable..."
              rows={5}
            />
          </div>

          <div className="rounded-lg bg-muted/60 px-3 py-2.5">
            <p className="mb-1.5 text-xs text-muted-foreground">You will appear as</p>
            <AnonymousIdentity user={currentUser} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}