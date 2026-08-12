export type AppointmentStatus = "PENDING" | "APPROVED" | "COMPLETED";

export interface Appointment {
  id: string;
  reason: string;
  status: AppointmentStatus;
  requestedAt: string | Date;
  scheduledAt: string | Date | null;
  completedAt: string | Date | null;
  durationMinutes: number;
  sessionNote: string | null;
  student: {
    name: string | null;
    institution: {
      name: string | null;
      code: string;
    };
  };
}
