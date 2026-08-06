export interface Counsellor {
  id: string;
  name: string;
  initials: string;
  email: string;
  specialties: string[];
  joinedAt: string; // ISO
}

export interface Invite {
  id: string;
  email: string;
  sentAt: string; // ISO
  note?: string;
}