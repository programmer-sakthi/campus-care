import { LogOut } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/card";
import type { Membership } from "../types/types";
import { formatJoinedDate } from "../utils/format";
import { InstitutionCodeBadge } from "./InstitutionCodeBadge";

interface InstitutionCardProps {
  membership: Membership;
  onLeave: (membership: Membership) => void;
}

export function InstitutionCard({ membership, onLeave }: InstitutionCardProps) {
  const { institution } = membership;

  return (
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <InstitutionCodeBadge code={institution.code} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium text-neutral-900">
              {institution.name}
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Member since {formatJoinedDate(membership.joinedAt)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <Badge
          variant="outline"
          className="border-neutral-200 font-normal text-neutral-500"
        >
          {membership.activeApplications === 0
            ? "No active applications"
            : `${membership.activeApplications} active application${
                membership.activeApplications === 1 ? "" : "s"
              }`}
        </Badge>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-red-600"
          onClick={() => onLeave(membership)}
        >
          <LogOut className="h-3.5 w-3.5" />
          Leave
        </Button>
      </CardFooter>
    </Card>
  );
}