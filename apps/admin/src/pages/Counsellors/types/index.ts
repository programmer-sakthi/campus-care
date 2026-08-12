export interface Counsellor {
  name: string;
  email: string;
  joinedAt: string; // ISO
}

export interface Invite {
  counsellorEmail: string;
  invitedAt: string; // ISO
  counsellor: {
    email: string;
    name?: string | null;
    createdAt: string;
  };
}