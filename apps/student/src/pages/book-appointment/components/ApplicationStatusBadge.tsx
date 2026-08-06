import { Badge } from "@repo/ui/components/badge";
import type { ApplicationStatus } from "../types";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-[#F3E4C9] text-[#7A5A17] hover:bg-[#F3E4C9]",
  scheduled: "bg-[#EDF2EF] text-[#3F5A4E] hover:bg-[#EDF2EF]",
  completed: "bg-neutral-100 text-neutral-500 hover:bg-neutral-100",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Awaiting a time",
  scheduled: "Scheduled",
  completed: "Completed",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge className={`border-none ${statusStyles[status]}`}>{statusLabels[status]}</Badge>;
}