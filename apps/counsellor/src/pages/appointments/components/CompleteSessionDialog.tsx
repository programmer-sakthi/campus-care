import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";

import type { Appointment } from "../types/appointment";
import { nameFont } from "../utils/styles";

interface Props {
  appointment: Appointment | null;
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function CompleteSessionDialog({
  appointment,
  note,
  setNote,
  onClose,
  onConfirm,
  isSaving,
}: Props) {
  return (
    <Dialog open={!!appointment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={nameFont} className="text-xl font-medium">
            {appointment &&
              `Complete session with ${appointment.student.name ?? "student"}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="session-note">Session note</Label>
          <Textarea
            id="session-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Summarize the session, concerns, and next steps..."
            className="min-h-28 resize-none"
          />
          <p className="text-xs text-neutral-500">
            A session note of at least 5 characters is required.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800"
            onClick={onConfirm}
            disabled={note.trim().length < 5 || isSaving}
          >
            {isSaving ? "Completing…" : "Complete session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
