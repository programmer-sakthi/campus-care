export interface Counsellor {
  name: string;
  email: string;
  joinedAt: string; // ISO
}

export interface Invite {
  id: string;
  email: string;
  sentAt: string; // ISO
  note?: string;
}