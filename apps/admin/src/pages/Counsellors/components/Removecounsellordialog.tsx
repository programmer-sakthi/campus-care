import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import type { Counsellor } from "../types";

interface RemoveCounsellorDialogProps {
  counsellor: Counsellor | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (counsellor: Counsellor) => void;
}

export function RemoveCounsellorDialog({
  counsellor,
  onOpenChange,
  onConfirm,
}: RemoveCounsellorDialogProps) {
  return (
    <Dialog open={!!counsellor} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove {counsellor?.name}?</DialogTitle>
          <DialogDescription>
            They'll lose access to your students' applications and chats. Any sessions
            already in progress won't be affected, but no new applications will be routed
            to them.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => counsellor && onConfirm(counsellor)}
          >
            Remove counsellor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}