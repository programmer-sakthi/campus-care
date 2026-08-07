import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Mail, Users } from "lucide-react";
import { CounsellorListItem } from "./components/Counsellorlistitem";
import { InviteCounsellorDialog } from "./components/InviteCounsellorDialog";
import { PendingInviteItem } from "./components/Pendinginviteitem";
import { RemoveCounsellorDialog } from "./components/Removecounsellordialog";
import { initialCounsellors, initialInvites } from "./mockdata/counsellors";
import type { Counsellor, Invite } from "./types";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export default function Counsellors() {
  
  // TODO : CALL THE INSTITUTION STORED IN LOCAL STORAGE

  const { data: availableCounsellors } = useQuery(trpc.institution.availableCounsellors.queryOptions({
    institutionCode: "SKCET"
  }))

  const [counsellors, setCounsellors] = useState<Counsellor[]>(initialCounsellors);
  const [invites, setInvites] = useState<Invite[]>(initialInvites);
  const [removeTarget, setRemoveTarget] = useState<Counsellor | null>(null);

  function handleInvite(email: string, note?: string) {
    const alreadyInvited = invites.some((i) => i.email.toLowerCase() === email.toLowerCase());
    const alreadyActive = counsellors.some(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (alreadyInvited || alreadyActive) return;

    setInvites((prev) => [
      { id: `inv-${Date.now()}`, email, sentAt: new Date().toISOString(), note },
      ...prev,
    ]);
  }

  function handleResend(invite: Invite) {
    setInvites((prev) =>
      prev.map((i) => (i.id === invite.id ? { ...i, sentAt: new Date().toISOString() } : i))
    );
  }

  function handleCancel(invite: Invite) {
    setInvites((prev) => prev.filter((i) => i.id !== invite.id));
  }

  function handleRemoveConfirm(counsellor: Counsellor) {
    setCounsellors((prev) => prev.filter((c) => c.id !== counsellor.id));
    setRemoveTarget(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Counsellors
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Invite counsellors by email and manage who currently has access.
          </p>
        </div>
        <InviteCounsellorDialog onInvite={handleInvite} />
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active counsellors
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {counsellors.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending invites
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {invites.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ACTIVE */}
        <TabsContent value="active" className="mt-0">
          {availableCounsellors?.length === 0 ? (
            <EmptyState
              icon={<Users className="h-5 w-5" />}
              title="No active counsellors yet"
              description="Invite a counsellor by email to get started."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {availableCounsellors?.map((counsellor) => (
                <CounsellorListItem
                  key={counsellor.email}
                  counsellor={counsellor}
                  onRemove={setRemoveTarget}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-0">
          {invites.length === 0 ? (
            <EmptyState
              icon={<Mail className="h-5 w-5" />}
              title="No pending invites"
              description="Invitations you send will show up here until they're accepted."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {invites.map((invite) => (
                <PendingInviteItem
                  key={invite.id}
                  invite={invite}
                  onResend={handleResend}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RemoveCounsellorDialog
        counsellor={removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        onConfirm={handleRemoveConfirm}
      />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        {icon}
      </div>
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="max-w-xs text-sm text-neutral-500">{description}</p>
    </div>
  );
}