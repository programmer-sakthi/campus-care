import { AppointmentTabs } from "./components/AppointmentTabs";

import { ScheduleDialog } from "./components/ScheduleDialog";
import { CompleteSessionDialog } from "./components/CompleteSessionDialog";

import { useAppointments } from "./hooks/useAppointments";

export default function Appointments() {
  const {
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
    isLoading,
    error,
    isScheduling,
    isCompleting,
  } = useAppointments();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Appointments
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Schedule counselling requests and record completed sessions.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading appointments…</p>
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not load appointments. Please try again.
        </p>
      ) : (
        <AppointmentTabs
          active={active}
          completed={completed}
          openSchedule={openSchedule}
          openComplete={openComplete}
        />
      )}

      <ScheduleDialog
        appointment={scheduleTarget}
        value={scheduleValue}
        setValue={setScheduleValue}
        onClose={() => setScheduleTarget(null)}
        onConfirm={confirmSchedule}
        isSaving={isScheduling}
      />

      <CompleteSessionDialog
        appointment={completeTarget}
        note={sessionNote}
        setNote={setSessionNote}
        onClose={() => setCompleteTarget(null)}
        onConfirm={confirmComplete}
        isSaving={isCompleting}
      />
    </div>
  );
}
