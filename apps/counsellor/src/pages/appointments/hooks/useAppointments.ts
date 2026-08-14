import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc, trpcClient } from "../../../lib/trpc";
import type { Appointment } from "../types/appointment";
import { toDatetimeLocal } from "../utils/date";

export function useAppointments() {
  const email = useMemo(
    () => JSON.parse(window.localStorage.getItem("campus-care.session") ?? "null")?.user?.counsellorEmail ?? "",
    [],
  );
  const pendingQuery = useQuery({
    ...trpc.counsellor.appointmentRequests.queryOptions({
      counsellorEmail: email,
    }),
    refetchInterval: 15_000,
  });
  const scheduledQuery = useQuery({
    ...trpc.counsellor.scheduledAppointments.queryOptions({
      counsellorEmail: email,
    }),
    refetchInterval: 15_000,
  });
  const completedQuery = useQuery({
    ...trpc.counsellor.completedAppointments.queryOptions({
      counsellorEmail: email,
    }),
    refetchInterval: 15_000,
  });

  const [scheduleTarget, setScheduleTarget] = useState<Appointment | null>(
    null,
  );

  const [scheduleValue, setScheduleValue] = useState("");

  const [completeTarget, setCompleteTarget] = useState<Appointment | null>(
    null,
  );
  const [sessionNote, setSessionNote] = useState("");

  const refresh = () => {
    pendingQuery.refetch();
    scheduledQuery.refetch();
    completedQuery.refetch();
  };

  const scheduleMutation = useMutation({
    mutationFn: ({
      appointmentId,
      scheduledAt,
    }: {
      appointmentId: string;
      scheduledAt: Date;
    }) =>
      trpcClient.counsellor.approveAppointment.mutate({
        appointmentId,
        counsellorEmail: email,
        scheduledAt,
      }),
    onSuccess: () => {
      setScheduleTarget(null);
      refresh();
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({
      appointmentId,
      note,
    }: {
      appointmentId: string;
      note: string;
    }) =>
      trpcClient.counsellor.completeAppointment.mutate({
        appointmentId,
        counsellorEmail: email,
        sessionNote: note,
      }),
    onSuccess: () => {
      setCompleteTarget(null);
      setSessionNote("");
      refresh();
    },
  });

  const active = useMemo(
    () =>
      [
        ...(pendingQuery.data ?? []),
        ...(scheduledQuery.data ?? []),
      ] as Appointment[],
    [pendingQuery.data, scheduledQuery.data],
  );

  const completed = useMemo(
    () => (completedQuery.data ?? []) as Appointment[],
    [completedQuery.data],
  );

  function openSchedule(appointment: Appointment) {
    setScheduleTarget(appointment);

    setScheduleValue(toDatetimeLocal(appointment.scheduledAt ?? undefined));
  }

  function confirmSchedule() {
    if (!scheduleTarget || !scheduleValue) return;

    scheduleMutation.mutate({
      appointmentId: scheduleTarget.id,
      scheduledAt: new Date(scheduleValue),
    });
  }

  function openComplete(appointment: Appointment) {
    setCompleteTarget(appointment);
    setSessionNote("");
  }

  function confirmComplete() {
    if (!completeTarget || sessionNote.trim().length < 5) return;
    completeMutation.mutate({
      appointmentId: completeTarget.id,
      note: sessionNote.trim(),
    });
  }

  return {
    active,
    completed,

    scheduleTarget,
    scheduleValue,
    setScheduleTarget,
    setScheduleValue,

    openSchedule,
    confirmSchedule,
    completeTarget,
    sessionNote,
    setCompleteTarget,
    setSessionNote,
    openComplete,
    confirmComplete,
    isLoading:
      pendingQuery.isLoading ||
      scheduledQuery.isLoading ||
      completedQuery.isLoading,
    error:
      pendingQuery.error ??
      scheduledQuery.error ??
      completedQuery.error ??
      scheduleMutation.error ??
      completeMutation.error,
    isScheduling: scheduleMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
