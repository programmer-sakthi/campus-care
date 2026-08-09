import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";

interface CommentComposerProps {
  onSubmit: (content: string) => void;
}

export function CommentComposer({ onSubmit }: CommentComposerProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setContent("");
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="comment-content" className="text-sm font-medium text-foreground">
        Join the conversation
      </label>
      <Textarea
        id="comment-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share something supportive..."
        rows={3}
      />
      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit} disabled={content.trim().length === 0}>
          Comment
        </Button>
      </div>
    </div>
  );
}