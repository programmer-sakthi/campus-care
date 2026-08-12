import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";

interface ForumHeaderProps {
  onCreatePost: () => void;
}

export function ForumHeader({ onCreatePost }: ForumHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Peer Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A safe place to share, listen and support each other anonymously.
        </p>
      </div>
      <Button type="button" onClick={onCreatePost} className="w-fit gap-2">
        <Plus size={16} />
        Create post
      </Button>
    </div>
  );
}