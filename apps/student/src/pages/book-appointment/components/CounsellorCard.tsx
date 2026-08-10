import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { MessageSquare, Send } from "lucide-react";

interface Counsellor {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
  counsellorId: string;
  reason: string;
  status: string;
  requestedAt: string;
}

interface CounsellorCardProps {
  counsellor: Counsellor;
  existingApplication?: Application;
  onRequest: (counsellor: Counsellor) => void;
  onOpenChat: (application: Application) => void;
}

export function CounsellorCard({
  counsellor,
  existingApplication,
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

      <CardFooter>
        {existingApplication ? (
          <Button
            variant="outline"
            className="w-full gap-1.5 border-neutral-200"
            onClick={() => onOpenChat(existingApplication)}
          >
            <MessageSquare className="h-4 w-4" />
            Open chat
          </Button>
        ) : (
          <Button
            className="w-full gap-1.5 bg-neutral-900 hover:bg-neutral-800"
            onClick={() => onRequest(counsellor)}
          >
            <Send className="h-4 w-4" />
            Request session
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
