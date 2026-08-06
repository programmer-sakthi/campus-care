import type { Counsellor, Invite } from "../types/index";

// Swap this file for real API calls later — components only depend on the
// shapes in ../types, not on how the data is fetched.

export const initialCounsellors: Counsellor[] = [
  {
    id: "c-1",
    name: "Dr. Neha Sharma",
    initials: "NS",
    email: "neha.sharma@counsellors.example",
    specialties: ["Anxiety & stress", "Exam pressure"],
    joinedAt: "2025-11-04T09:00:00",
  },
  {
    id: "c-2",
    name: "Dr. Vikram Rao",
    initials: "VR",
    email: "vikram.rao@counsellors.example",
    specialties: ["Depression & mood", "Relationships"],
    joinedAt: "2025-09-18T09:00:00",
  },
  {
    id: "c-3",
    name: "Dr. Sana Fernandes",
    initials: "SF",
    email: "sana.fernandes@counsellors.example",
    specialties: ["Trauma-informed care", "Family conflict"],
    joinedAt: "2026-01-22T09:00:00",
  },
];

export const initialInvites: Invite[] = [
  {
    id: "inv-1",
    email: "arjun.mehta@counsellors.example",
    sentAt: "2026-08-03T11:20:00",
    note: "Referred by Dr. Sharma for burnout and academic pressure cases.",
  },
  {
    id: "inv-2",
    email: "priya.das@counsellors.example",
    sentAt: "2026-08-05T09:00:00",
  },
];