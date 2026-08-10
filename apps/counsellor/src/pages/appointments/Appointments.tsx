import { AppointmentTabs } from './components/AppointmentTabs';

import { ScheduleDialog } from './components/ScheduleDialog';

import { useAppointments } from './hooks/useAppointments';

export default function Appointments() {
  const {
    active,
    completed,
    scheduleTarget,
    scheduleValue,
    reviewDrafts,
    setScheduleTarget,
    setScheduleValue,
    setReviewDrafts,
    openSchedule,
    confirmSchedule,
    saveReview,
  } = useAppointments();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Appointments
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Review counselling applications and manage session notes.
        </p>
      </div>

      <AppointmentTabs
        active={active}
        completed={completed}
        openSchedule={openSchedule}
        reviewDrafts={reviewDrafts}
        setReviewDrafts={setReviewDrafts}
        saveReview={saveReview}
      />

      <ScheduleDialog
        appointment={scheduleTarget}
        value={scheduleValue}
        setValue={setScheduleValue}
        onClose={() => setScheduleTarget(null)}
        onConfirm={confirmSchedule}
      />
    </div>
  );
}
