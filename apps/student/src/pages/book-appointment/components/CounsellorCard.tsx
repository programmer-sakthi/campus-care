import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { MessageSquare, Send } from "lucide-react";

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

export function CounsellorCard({
  counsellor,
  latestApplication,
  activeApplication,
  onRequest,
  onOpenChat,
}: CounsellorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-base font-semibold text-neutral-900">
            {counsellor.name}
          </h3>

          <p className="mt-1 text-sm text-neutral-500">{counsellor.email}</p>
        </div>
      </CardHeader>

      <CardContent />

      <CardFooter className="flex-col items-stretch gap-2">
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
          <p className="text-xs text-amber-700">
            You already have an active appointment with this counsellor. Complete it before booking another one.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
