import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { BookingDialog } from "./components/BookingDialog";
import { CounsellorCard } from "./components/CounsellorCard";
import { counsellors } from "./mockdata/counsellors";
import { initialApplications } from "./mockdata/applications";
import { currentStudent } from "./mockdata/profile";
import { formatDateTime, timeAgo } from "./utils/format";
import type { Application, Counsellor } from "./types";

interface BookingProps {
  /** Called when the student wants to jump into chat for an application */
  onOpenChat?: (applicationId: string) => void;
}

export default function Booking({ onOpenChat }: BookingProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [bookingTarget, setBookingTarget] = useState<Counsellor | null>(null);

  const applicationByCounsellor = useMemo(() => {
    const map = new Map<string, Application>();
    applications.forEach((a) => map.set(a.counsellorId, a));
    return map;
  }, [applications]);

  function handleSubmitRequest(counsellor: Counsellor, reason: string) {
    const application: Application = {
      id: `app-${Date.now()}`,
      counsellorId: counsellor.id,
      reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    setApplications((prev) => [...prev, application]);
    setBookingTarget(null);
  }

  function handleOpenChat(application: Application) {
    onOpenChat?.(application.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Book a counsellor
        </h1>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
          <Building2 className="h-4 w-4" />
          Counsellors available through {currentStudent.institutionName}
        </div>
      </div>

      {applications.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-neutral-600">Your applications</h2>
          <div className="flex flex-col gap-2">
            {applications.map((application) => {
              const counsellor = counsellors.find((c) => c.id === application.counsellorId)!;
              return (
                <button
                  key={application.id}
                  onClick={() => handleOpenChat(application)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {counsellor.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {application.status === "scheduled" && application.scheduledAt
                        ? formatDateTime(application.scheduledAt)
                        : `Requested ${timeAgo(application.requestedAt)}`}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-medium text-neutral-600">Available counsellors</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {counsellors.map((counsellor) => (
          <CounsellorCard
            key={counsellor.id}
            counsellor={counsellor}
            existingApplication={applicationByCounsellor.get(counsellor.id)}
            onRequest={setBookingTarget}
            onOpenChat={handleOpenChat}
          />
        ))}
      </div>

      <BookingDialog
        counsellor={bookingTarget}
        onOpenChange={(open) => !open && setBookingTarget(null)}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}