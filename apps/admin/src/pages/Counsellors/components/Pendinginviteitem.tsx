import { Button } from "@repo/ui/components/button";
import { Mail, RotateCw, X } from "lucide-react";
import type { Invite } from "../types";
import { timeAgo } from "../utils/format";

interface PendingInviteItemProps {
  invite: Invite;
  onResend: (invite: Invite) => void;
  onCancel: (invite: Invite) => void;
}

export function PendingInviteItem({ invite, onResend, onCancel }: PendingInviteItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-dashed border-neutral-200 bg-white px-4 py-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        <Mail className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900">{invite.email}</p>
        <p className="mt-0.5 font-mono text-[11px] text-neutral-400">
          Invited {timeAgo(invite.sentAt)}
        </p>
        {invite.note && (
          <p className="mt-2 rounded-lg border-l-2 border-neutral-200 bg-neutral-50 px-3 py-2 text-sm leading-relaxed text-neutral-600">
            {invite.note}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-neutral-200 text-neutral-600"
          onClick={() => onResend(invite)}
        >
          <RotateCw className="h-3.5 w-3.5" />
          Resend
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-red-600"
          onClick={() => onCancel(invite)}
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}