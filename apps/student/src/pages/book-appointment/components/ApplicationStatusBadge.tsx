import { Badge } from "@repo/ui/components/badge";
import { CheckCircle2, Clock3, CalendarCheck2 } from "lucide-react";
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

const statusIcons: Record<ApplicationStatus, typeof Clock3> = {
  pending: Clock3,
  scheduled: CalendarCheck2,
  completed: CheckCircle2,
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const Icon = statusIcons[status];

  return (
    <Badge className={`gap-1.5 border-none px-2.5 py-1 ${statusStyles[status]}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      {statusLabels[status]}
    </Badge>
  );
}