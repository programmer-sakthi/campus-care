import { Check, X } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/card";
import type { Invitation } from "../types/types";
import { timeAgo } from "../utils/format";
import { InstitutionCodeBadge } from "./InstitutionCodeBadge";

// Institution names use plain sans-serif — only counsellor/student names use
// the serif type elsewhere in the app, keeping that treatment meaningful.
interface InvitationCardProps {
  invitation: Invitation;
  onAccept: (invitation: Invitation) => void;
  onReject: (invitation: Invitation) => void;
}

export function InvitationCard({ invitation, onAccept, onReject }: InvitationCardProps) {
  const { institution } = invitation;

  return (
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <InstitutionCodeBadge code={institution.code} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium text-neutral-900">
              {institution.name}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-neutral-400">
              Invited {timeAgo(invitation.sentAt)}
            </p>
          </div>
        </div>
      </CardHeader>

      {invitation.note && (
        <CardContent className="pb-4">
          <p className="rounded-lg border-l-2 border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm leading-relaxed text-neutral-600">
            {invitation.note}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="outline"
          className="flex-1 gap-1.5 border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
          onClick={() => onReject(invitation)}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
        <Button
          className="flex-1 gap-1.5 bg-neutral-900 hover:bg-neutral-800"
          onClick={() => onAccept(invitation)}
        >
          <Check className="h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}