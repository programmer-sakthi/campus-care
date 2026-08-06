export interface Counsellor {
  id: string;
  name: string;
  initials: string;
  specialties: string[];
  bio: string;
  yearsExperience: number;
  availability: "available" | "limited";
}

export type ApplicationStatus = "pending" | "scheduled" | "completed";

export interface Application {
  id: string;
  counsellorId: string;
  reason: string;
  status: ApplicationStatus;
  requestedAt: string; // ISO
  scheduledAt?: string; // ISO, set once the counsellor fixes a time
}

export interface Message {
  id: string;
  sender: "student" | "counsellor";
  text: string;
  time: string; // ISO
}