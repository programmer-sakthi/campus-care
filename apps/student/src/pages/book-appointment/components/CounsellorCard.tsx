import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/card";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { MessageSquare, Send } from "lucide-react";
import type { Application, Counsellor } from "../types";

// Person names render in Fraunces across the app — the one warm, human
// typographic signal against an otherwise plain sans-serif UI.
const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

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
    <Card className="border-neutral-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-[#EDF2EF] text-sm font-medium text-[#3F5A4E]">
              {counsellor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-medium text-neutral-900" style={nameFont}>
                {counsellor.name}
              </h3>
              <span
                className={[
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  counsellor.availability === "available" ? "bg-[#4F6F62]" : "bg-[#C99A3B]",
                ].join(" ")}
              />
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">
              {counsellor.yearsExperience} years experience ·{" "}
              {counsellor.availability === "available" ? "Available" : "Limited slots"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {counsellor.specialties.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="border-neutral-200 font-normal text-neutral-600"
            >
              {s}
            </Badge>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-neutral-500">{counsellor.bio}</p>
      </CardContent>

      <CardFooter className="pt-0">
        {existingApplication ? (
          <Button
            variant="outline"
            className="w-full gap-1.5 border-neutral-200"
            onClick={() => onOpenChat(existingApplication)}
          >
            <MessageSquare className="h-4 w-4" />
            {existingApplication.status === "pending"
              ? "Application sent · Open chat"
              : "Open chat"}
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