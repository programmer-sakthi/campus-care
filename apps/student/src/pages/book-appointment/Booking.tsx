import { useMemo, useState } from "react";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { BookingDialog } from "./components/BookingDialog";
import { CounsellorCard } from "./components/CounsellorCard";
import { formatDateTime, timeAgo } from "./utils/format";
import type { Application, ApplicationStatus } from "./types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useNavigate } from "react-router";

interface BookingProps {
  onOpenChat?: (applicationId: string) => void;
}

interface DBCounsellor {
  email: string;
  name: string | null;
}

export default function Booking({ onOpenChat }: BookingProps) {
  const [bookingTarget, setBookingTarget] = useState<DBCounsellor | null>(null);
  const navigate = useNavigate();

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

  // Get student's appointments
  const { data: appointments, refetch: refetchAppointments } = useQuery(
    trpc.student.myAppointments.queryOptions({
      studentRegNo: regNo,
    }),
  );

  // Map backend appointments to frontend applications
  const applications = useMemo<Application[]>(() => {
    if (!appointments) return [];
    return appointments.map((appointment) => {
      let status: ApplicationStatus = "pending";
      if (appointment.status === "APPROVED") {
        status = "scheduled";
      } else if (appointment.status === "COMPLETED") {
        status = "completed";
      }
      return {
        id: appointment.id,
        counsellorId: appointment.counsellorEmail,
        reason: appointment.reason,
        status,
        requestedAt: appointment.requestedAt
          ? new Date(appointment.requestedAt).toISOString()
          : new Date().toISOString(),
        scheduledAt: appointment.scheduledAt
          ? new Date(appointment.scheduledAt).toISOString()
          : undefined,
      };
    });
  }, [appointments]);

  const latestApplicationByCounsellor = useMemo(() => {
    const map = new Map<string, Application>();

    applications.forEach((application) => {
      if (!map.has(application.counsellorId)) {
        map.set(application.counsellorId, application);
      }
    });

    return map;
  }, [applications]);

  const activeApplicationByCounsellor = useMemo(() => {
    const map = new Map<string, Application>();

    applications.forEach((application) => {
      if (
        (application.status === "pending" || application.status === "scheduled") &&
        !map.has(application.counsellorId)
      ) {
        map.set(application.counsellorId, application);
      }
    });

    return map;
  }, [applications]);

  const createAppointment = useMutation(
    trpc.student.createAppointment.mutationOptions({
      onSuccess: () => {
        refetchAppointments();
        setBookingTarget(null);
      },
    }),
  );

  function handleSubmitRequest(counsellor: DBCounsellor, reason: string) {
    createAppointment.mutate({
      studentRegNo: regNo,
      counsellorEmail: counsellor.email,
      reason,
    });
  }

  function handleOpenChat(application: Application) {
    if (onOpenChat) {
      onOpenChat(application.id);
      return;
    }

    navigate("/chat");
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
                (c) => c.email === application.counsellorId,
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
              const latestApplication = latestApplicationByCounsellor.get(
                counsellor.email,
              );
              const activeApplication = activeApplicationByCounsellor.get(
                counsellor.email,
              );

              return (
                <CounsellorCard
                  key={counsellor.email}
                  counsellor={counsellor}
                  latestApplication={latestApplication}
                  activeApplication={activeApplication}
                  onRequest={() => setBookingTarget(counsellor)}
                  onOpenChat={() => {
                    if (latestApplication) {
                      handleOpenChat(latestApplication);
                    }
                  }}
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
