import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Mail, UserPlus } from "lucide-react";
import { isValidEmail } from "../utils/format";

interface InviteCounsellorDialogProps {
  onInvite: (email: string, note?: string) => void;
}

export function InviteCounsellorDialog({ onInvite }: InviteCounsellorDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const valid = isValidEmail(email);

  function reset() {
    setEmail("");
    setNote("");
  }

  function handleSubmit() {
    if (!valid) return;
    onInvite(email.trim(), note.trim() || undefined);
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-neutral-900 hover:bg-neutral-800">
          <UserPlus className="h-4 w-4" />
          Invite counsellor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Invite a counsellor</DialogTitle>
          <DialogDescription>
            We'll send an email invitation. Once accepted, they'll appear in your active
            counsellors list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-note">Note (optional)</Label>
            <Textarea
              id="invite-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Let them know what you'd like their focus to be..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-neutral-900 hover:bg-neutral-800"
            disabled={!valid}
            onClick={handleSubmit}
          >
            Send invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}