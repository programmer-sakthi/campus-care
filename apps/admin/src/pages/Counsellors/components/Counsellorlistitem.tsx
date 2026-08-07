import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Mail, UserMinus } from "lucide-react";
import { formatJoinedDate } from "../utils/format";
import type { Counsellor } from "@repo/database";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface CounsellorListItemProps {
  counsellor: Counsellor;
  onRemove: (counsellor: Counsellor) => void;
}

export function CounsellorListItem({ counsellor, onRemove }: CounsellorListItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white px-4 py-3.5">
      <Avatar className="h-11 w-11 shrink-0">
        <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
          {counsellor.name?.at(0)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-base font-medium text-neutral-900" style={nameFont}>
            {counsellor.name}
          </h3>
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <Mail className="h-3.5 w-3.5" />
            {counsellor.email}
          </span>
        </div>

        <p className="mt-2 text-xs text-neutral-400">
          Joined {formatJoinedDate(counsellor.createdAt)}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="shrink-0 gap-1.5 border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-red-600"
        onClick={() => onRemove(counsellor)}
      >
        <UserMinus className="h-3.5 w-3.5" />
        Remove
      </Button>
    </div>
  );
}