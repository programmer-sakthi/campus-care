import { useState, useMemo, type ReactNode } from "react";
import { Inbox, School } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { InstitutionCard } from "./components/InstitutionCard";
import { InvitationCard } from "./components/InvitationCard";
import { LeaveInstitutionDialog } from "./components/LeaveInstitutionDialog";
import { trpc, trpcClient } from "../../lib/trpc";
import type { Institution, Invitation, Membership } from "./types/types";

export default function Institutions() {
  const email = useMemo(() => {
    if (typeof window === "undefined") {
      return "sakthi@gmail.com";
    }

    return window.localStorage.getItem("email") ?? "sakthi@gmail.com";
  }, []);

  const pendingInvitationsQuery = useQuery(
    trpc.counsellor.pendingInvitations.queryOptions({ email })
  );

  const joinedInstitutionsQuery = useQuery(
    trpc.counsellor.joinedInstitutions.queryOptions({ email })
  );

  const acceptMutation = useMutation({
    mutationFn: (institutionCode: string) =>
      trpcClient.counsellor.acceptInvitation.mutate({
        email,
        institutionCode,
      }),
    onSuccess: () => {
      pendingInvitationsQuery.refetch();
      joinedInstitutionsQuery.refetch();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (institutionCode: string) =>
      trpcClient.counsellor.rejectInvitation.mutate({
        email,
        institutionCode,
      }),
    onSuccess: () => {
      pendingInvitationsQuery.refetch();
    },
  });

  const leaveMutation = useMutation({
    mutationFn: (institutionCode: string) =>
      trpcClient.counsellor.leaveInstitution.mutate({
        email,
        institutionCode,
      }),
    onSuccess: () => {
      joinedInstitutionsQuery.refetch();
    },
  });

  const [leaveTarget, setLeaveTarget] = useState<Institution | null>(null);

  const invitations = useMemo<Invitation[]>(() => {
    if (!pendingInvitationsQuery.data) return [];
    return pendingInvitationsQuery.data.map((item) => ({
      id: `${item.institutionCode}-${item.counsellorEmail}`,
      institution: {
        id: item.institutionCode,
        name: item.institution.name ?? "",
        code: item.institutionCode,
      },
      sentAt: typeof item.invitedAt === "string" ? item.invitedAt : item.invitedAt.toISOString(),
    }));
  }, [pendingInvitationsQuery.data]);

  const memberships = useMemo<Membership[]>(() => {
    if (!joinedInstitutionsQuery.data) return [];
    return joinedInstitutionsQuery.data.map((item) => ({
      institution: {
        id: item.institutionCode,
        name: item.institution.name ?? "",
        code: item.institutionCode,
      },
      joinedAt: item.joinedAt ? (typeof item.joinedAt === "string" ? item.joinedAt : item.joinedAt.toISOString()) : new Date().toISOString(),
      activeApplications: 0,
    }));
  }, [joinedInstitutionsQuery.data]);

  function handleAccept(invitation: Invitation) {
    acceptMutation.mutate(invitation.institution.code);
  }

  function handleReject(invitation: Invitation) {
    rejectMutation.mutate(invitation.institution.code);
  }

  function handleLeaveConfirm(institution: Institution) {
    leaveMutation.mutate(institution.code);
    setLeaveTarget(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Institutions
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage invitations and the institutions you currently support.
        </p>
      </div>

      <Tabs defaultValue="invitations">
        <TabsList className="mb-6">
          <TabsTrigger value="invitations">
            Active invitations
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {invitations.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="institutions">
            Your institutions
            <span className="ml-1.5 rounded-full bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
              {memberships.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* INVITATIONS */}
        <TabsContent value="invitations" className="mt-0">
          {invitations.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="No pending invitations"
              description="When an institution admin invites you to counsel their students, it'll show up here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* INSTITUTIONS */}
        <TabsContent value="institutions" className="mt-0">
          {memberships.length === 0 ? (
            <EmptyState
              icon={<School className="h-5 w-5" />}
              title="You're not part of any institution yet"
              description="Accept an invitation to start receiving counselling applications."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {memberships.map((membership) => (
                <InstitutionCard
                  key={membership.institution.id}
                  membership={membership}
                  onLeave={(m) => setLeaveTarget(m.institution)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <LeaveInstitutionDialog
        institution={leaveTarget}
        onOpenChange={(open) => !open && setLeaveTarget(null)}
        onConfirm={handleLeaveConfirm}
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