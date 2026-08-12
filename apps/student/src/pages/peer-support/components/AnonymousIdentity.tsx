import { Badge } from "@repo/ui/components/badge";
import type { AnonymousUser } from "../types/peerSupport";

interface AnonymousIdentityProps {
  user: AnonymousUser;
  timestamp?: string;
  size?: "sm" | "default";
}

export function AnonymousIdentity({ user, timestamp, size = "default" }: AnonymousIdentityProps) {
  const dotColor = user.role === "Peer" ? "bg-sky-400" : "bg-emerald-400";
  const nameSize = size === "sm" ? "text-sm" : "text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} aria-hidden="true" />
      <span className={`font-medium text-foreground ${nameSize}`}>{user.username}</span>
      <Badge
        variant="secondary"
        className={
          user.role === "Peer"
            ? "border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-50"
            : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
        }
      >
        {user.role}
      </Badge>
      {timestamp && (
        <>
          <span className="text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </>
      )}
    </div>
  );
}