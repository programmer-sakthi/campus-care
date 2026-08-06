import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import type { Counsellor } from "../types";

const nameFont = { fontFamily: "'Fraunces', Georgia, serif" };

interface BookingDialogProps {
  counsellor: Counsellor | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (counsellor: Counsellor, reason: string) => void;
}

export function BookingDialog({ counsellor, onOpenChange, onSubmit }: BookingDialogProps) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={nameFont} className="text-xl font-medium">
            {counsellor && `Request a session with ${counsellor.name}`}
          </DialogTitle>
          <DialogDescription>
            Share a little about what's going on. {counsellor?.name.split(" ")[1] ?? "They"} will
            read this and reach out over chat to fix a time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="reason">Reason for applying</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. I've been feeling anxious about exams and it's affecting my sleep..."
            className="min-h-[100px] resize-none text-sm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800"
            disabled={!reason.trim()}
            onClick={handleSubmit}
          >
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}