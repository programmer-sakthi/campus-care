import { useMemo, useState } from "react";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { BookingDialog } from "./components/BookingDialog";
import { CounsellorCard } from "./components/CounsellorCard";
import { initialApplications } from "./mockdata/applications";
import { formatDateTime, timeAgo } from "./utils/format";
import type { Application, Counsellor } from "./types";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface BookingProps {
  onOpenChat?: (applicationId: string) => void;
}

export default function Booking({ onOpenChat }: BookingProps) {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);

  const [bookingTarget, setBookingTarget] = useState<Counsellor | null>(null);

  const regNo = useMemo(() => {
    if (typeof window === "undefined") {
      return "22IT001";
    }

    return window.localStorage.getItem("regNo") ?? "22IT001";
  }, []);

  // Get student's institution
  const { data: institution } = useQuery(
    trpc.student.getInstitutionByRegNo.queryOptions({
      regNo,
    }),
  );

  // Get counsellors belonging to that institution
  const { data: availableCounsellors, isLoading: counsellorsLoading } =
    useQuery({
      ...trpc.student.getCounsellorsByInstitution.queryOptions({
        institutionCode: institution?.code ?? "",
      }),
      enabled: !!institution?.code,
    });

  const applicationByCounsellor = useMemo(() => {
    const map = new Map<string, Application>();

    applications.forEach((application) => {
      map.set(application.counsellorId, application);
    });

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Book a counsellor
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Counsellors available through {institution?.name}
        </p>
      </div>

      {applications.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-neutral-600">
            Your applications
          </h2>

          <div className="flex flex-col gap-2">
            {applications.map((application) => {
              const counsellor = availableCounsellors?.find(
                (c) => c.id === application.counsellorId,
              );

              // Don't render applications whose counsellor
              // isn't present in the current institution's list.
              if (!counsellor) {
                return null;
              }

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
                      {application.status === "scheduled" &&
                      application.scheduledAt
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

      <div>
        <h2 className="mb-3 text-sm font-medium text-neutral-600">
          Available counsellors
        </h2>

        {counsellorsLoading ? (
          <p className="text-sm text-neutral-500">Loading counsellors...</p>
        ) : availableCounsellors?.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No counsellors are currently available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableCounsellors?.map((counsellor) => {
              const existingApplication = applicationByCounsellor.get(
                counsellor.id,
              );

              return (
                <CounsellorCard
                  key={counsellor.id}
                  counsellor={counsellor}
                  existingApplication={existingApplication}
                  onRequest={() => setBookingTarget(counsellor)}
                  onOpenChat={handleOpenChat}
                />
              );
            })}
          </div>
        )}
      </div>

      <BookingDialog
        counsellor={bookingTarget}
        onOpenChange={(open) => {
          if (!open) {
            setBookingTarget(null);
          }
        }}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}
