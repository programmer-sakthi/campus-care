import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { NotebookPen, SendHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
interface Counsellor {
  name: string | null;
  email: string;
}

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface BookingDialogProps {
  counsellor: Counsellor | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (counsellor: Counsellor, reason: string) => void;
}

export function BookingDialog({
  counsellor,
  onOpenChange,
  onSubmit,
}: BookingDialogProps) {
  const [reason, setReason] = useState("");

  function handleSubmit() {
    if (!counsellor || !reason.trim()) return;
    onSubmit(counsellor, reason.trim());
    setReason("");
  }

  return (
    <Dialog
      open={!!counsellor}
      onOpenChange={(open) => {
        if (!open) setReason("");
        onOpenChange(open);
      }}
    >
      <DialogContent className="p-6 sm:p-7">
        <DialogHeader className="gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF2EF] text-[#3F5A4E]">
            <NotebookPen className="h-5 w-5" strokeWidth={2} />
          </div>

          <DialogTitle style={nameFont} className="text-xl font-medium">
            {counsellor && `Request a session with ${counsellor.name}`}
          </DialogTitle>
          <DialogDescription>
            Share a little about what's going on.{" "}
            {counsellor?.name?.split(" ")[1] ?? "They"} will read this and reach
            out over chat to fix a time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-3">
          <Label htmlFor="reason">Reason for applying</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. I've been feeling anxious about exams and it's affecting my sleep..."
            className="min-h-[110px] resize-none text-sm"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="gap-1.5 bg-neutral-900 hover:bg-neutral-800"
            disabled={!reason.trim()}
            onClick={handleSubmit}
          >
            <SendHorizontal className="h-4 w-4" />
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}