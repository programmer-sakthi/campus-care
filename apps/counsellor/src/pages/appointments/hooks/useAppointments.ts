import { useMemo, useState } from 'react';
import {
  appointments as initialAppointments,
  type Appointment,
} from '../mock-data';
import { toDatetimeLocal } from '../utils/date';

export function useAppointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const [scheduleTarget, setScheduleTarget] = useState<Appointment | null>(
    null,
  );

  const [scheduleValue, setScheduleValue] = useState('');

  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});

  const active = useMemo(
    () =>
      appointments
        .filter((a) => a.status === 'pending' || a.status === 'scheduled')
        .sort((a, b) => (a.status === 'pending' ? -1 : 1)),
    [appointments],
  );

  const completed = useMemo(
    () => appointments.filter((a) => a.status === 'completed'),
    [appointments],
  );

  function openSchedule(appointment: Appointment) {
    setScheduleTarget(appointment);

    setScheduleValue(toDatetimeLocal(appointment.scheduledAt));
  }

  function confirmSchedule() {
    if (!scheduleTarget || !scheduleValue) return;

    const iso = new Date(scheduleValue).toISOString();

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === scheduleTarget.id
          ? {
              ...a,
              status: 'scheduled',
              scheduledAt: iso,
            }
          : a,
      ),
    );

    setScheduleTarget(null);
  }

  function saveReview(appointmentId: string) {
    const text = reviewDrafts[appointmentId];

    if (text === undefined) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              review: text,
            }
          : a,
      ),
    );
  }

  return {
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
  };
}
