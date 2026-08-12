import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import type { Institution } from "../types/types";

interface LeaveInstitutionDialogProps {
  institution: Institution | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (institution: Institution) => void;
}

export function LeaveInstitutionDialog({
  institution,
  onOpenChange,
  onConfirm,
}: LeaveInstitutionDialogProps) {
  return (
    <Dialog open={!!institution} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave {institution?.name}?</DialogTitle>
          <DialogDescription>
            You'll stop receiving new counselling applications from this institution.
            Students you're already talking with will stay in your chat until those
            sessions are complete.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => institution && onConfirm(institution)}
          >
            Leave institution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}