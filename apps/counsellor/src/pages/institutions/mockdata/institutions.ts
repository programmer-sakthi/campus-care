import type { Institution, Invitation, Membership } from "../types/types";

// Swap this file for real API calls later — components only depend on the
// shapes in ../types, not on how the data is fetched.

export const mockInvitations: Invitation[] = [
  {
    id: "inv-1",
    institution: {
      id: "inst-skct",
      name: "Sri Krishna College of Technology",
      code: "SKCT",
    },
    sentAt: "2026-08-02T10:15:00",
    note: "We'd like you to support our final-year students during placement season.",
  },
  {
    id: "inv-2",
    institution: {
      id: "inst-bps",
      name: "Bluebell Public School",
      code: "BPS",
    },
    sentAt: "2026-08-03T16:40:00",
  },
  {
    id: "inv-3",
    institution: {
      id: "inst-rvc",
      name: "Riverside Community College",
      code: "RVC",
    },
    sentAt: "2026-07-30T09:00:00",
    note: "Referred by Dr. Menon — covering two campuses this semester.",
  },
];

export const mockMemberships: Membership[] = [
  {
    institution: { id: "inst-1", name: "Greenfield University", code: "GFU" },
    joinedAt: "2025-11-04T09:00:00",
    activeApplications: 2,
  },
  {
    institution: { id: "inst-2", name: "St. Xavier's College", code: "SXC" },
    joinedAt: "2025-09-18T09:00:00",
    activeApplications: 2,
  },
  {
    institution: { id: "inst-3", name: "Northbridge Institute of Technology", code: "NBIT" },
    joinedAt: "2026-01-22T09:00:00",
    activeApplications: 1,
  },
];