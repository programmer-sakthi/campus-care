import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import type { Appointment } from "../types/appointment";

import { nameFont } from "../utils/styles";

interface Props {
  appointment: Appointment | null;

  value: string;

  setValue: (value: string) => void;

  onClose: () => void;

  onConfirm: () => void;

  isSaving: boolean;
}

export function ScheduleDialog({
  appointment,
  value,
  setValue,
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
              `Schedule with ${appointment.student.name ?? "student"}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="schedule-time">Session date & time</Label>

          <Input
            id="schedule-time"
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>

          <Button
            className="bg-neutral-900 hover:bg-neutral-800"
            onClick={onConfirm}
            disabled={!value || isSaving}
          >
            {isSaving ? "Scheduling…" : "Confirm time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
