import type { Application } from "../types";

export const initialApplications: Application[] = [
  {
    id: "app-1",
    counsellorId: "c-1",
    reason: "Struggling with exam anxiety and disrupted sleep over the past month.",
    status: "scheduled",
    requestedAt: "2026-08-01T09:12:00",
    scheduledAt: "2026-08-08T11:00:00",
  },
  {
    id: "app-2",
    counsellorId: "c-2",
    reason:
      "Feeling low and unmotivated lately — wanted to talk it through alongside my usual routine.",
    status: "pending",
    requestedAt: "2026-08-04T17:30:00",
  },
];