import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { Mail, MessageSquare, Send, TriangleAlert } from "lucide-react";

import type { Application } from "../types";

interface Counsellor {
  name: string | null;
  email: string;
}

interface CounsellorCardProps {
  counsellor: Counsellor;
  latestApplication?: Application;
  activeApplication?: Application;
  onRequest: () => void;
  onOpenChat: () => void;
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function CounsellorCard({
  counsellor,
  latestApplication,
  activeApplication,
  onRequest,
  onOpenChat,
}: CounsellorCardProps) {
  return (
    <Card className="gap-4 p-1">
      <CardHeader className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF2EF] text-sm font-semibold text-[#3F5A4E]">
            {getInitials(counsellor.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-neutral-900">
              {counsellor.name}
            </h3>

            <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-neutral-500">
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              {counsellor.email}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5" />

      <CardFooter className="flex-col items-stretch gap-2.5 px-5 pb-5">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-1.5 border-neutral-200"
            disabled={!latestApplication}
            onClick={onOpenChat}
          >
            <MessageSquare className="h-4 w-4" />
            Open chat
          </Button>

          <Button
            className="flex-1 gap-1.5 bg-neutral-900 hover:bg-neutral-800"
            disabled={!!activeApplication}
            onClick={onRequest}
          >
            <Send className="h-4 w-4" />
            Book appointment
          </Button>
        </div>

        {activeApplication && (
          <p className="flex items-start gap-1.5 text-xs text-amber-700">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            You already have an active appointment with this counsellor. Complete it before booking another one.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}