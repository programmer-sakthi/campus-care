import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Mail, Users } from "lucide-react";
import { CounsellorListItem } from "./components/Counsellorlistitem";
import { InviteCounsellorDialog } from "./components/InviteCounsellorDialog";
import { PendingInviteItem } from "./components/Pendinginviteitem";
import { RemoveCounsellorDialog } from "./components/Removecounsellordialog";
import type { Counsellor, Invite } from "./types";
import { trpc, trpcClient } from "../../lib/trpc";

export default function Counsellors() {
  const institutionCode = useMemo(() => {
    if (typeof window === "undefined") {
      return "SKCET";
    }

    return window.localStorage.getItem("institutionCode") ?? "SKCET";
  }, []);

  const { data: availableCounsellors } = useQuery(
    trpc.institution.availableCounsellors.queryOptions({ institutionCode })
  );

  const pendingInvitesQuery = useQuery(
    trpc.institution.pendingCounsellors.queryOptions({ institutionCode })
  );

  const inviteMutation = useMutation({
    mutationFn: (email: string) =>
      trpcClient.institution.inviteCounsellor.mutate({
        code: institutionCode,
        email,
      }),
    onSuccess: () => {
      pendingInvitesQuery.refetch();
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (email: string) =>
      trpcClient.counsellor.rejectInvitation.mutate({
        email,
        institutionCode,
      }),
    onSuccess: () => {
      pendingInvitesQuery.refetch();
    },
  });

  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [removeTarget, setRemoveTarget] = useState<Counsellor | null>(null);
  const pendingInvites = pendingInvitesQuery.data ?? [];

  function handleInvite(email: string, note?: string) {
    void note;
    inviteMutation.mutate(email);
  }

  function handleResend(invite: Invite) {
    void invite;
    pendingInvitesQuery.refetch();
  }

  function handleCancel(invite: Invite) {
    cancelInviteMutation.mutate(invite.counsellorEmail);
  }

  function handleRemoveConfirm(counsellor: Counsellor) {
    setCounsellors((prev) => prev.filter((c) => c.email !== counsellor.email));
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
              {availableCounsellors?.length ?? 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending invites
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {pendingInvites.length}
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
                  onRemove={(selectedCounsellor) =>
                    setRemoveTarget({
                      email: selectedCounsellor.email,
                      name: selectedCounsellor.name ?? "",
                      joinedAt: selectedCounsellor.createdAt,
                    })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-0">
          {pendingInvites.length === 0 ? (
            <EmptyState
              icon={<Mail className="h-5 w-5" />}
              title="No pending invites"
              description="Invitations you send will show up here until they're accepted."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pendingInvites.map((invite) => (
                <PendingInviteItem
                  key={invite.counsellorEmail}
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