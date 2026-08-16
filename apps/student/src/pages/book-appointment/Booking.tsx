import { useMemo, useState } from "react";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { BookingDialog } from "./components/BookingDialog";
import { CounsellorCard } from "./components/CounsellorCard";
import { formatDateTime, timeAgo } from "./utils/format";
import type { Application, ApplicationStatus } from "./types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useNavigate } from "react-router";
import {
  CalendarClock,
  ChevronRight,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

interface DBCounsellor {
  email: string;
  name: string | null;
}

export default function Booking() {
  const [bookingTarget, setBookingTarget] = useState<DBCounsellor | null>(null);
  const navigate = useNavigate();

  const regNo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return JSON.parse(window.localStorage.getItem("campus-care.session") ?? "null")?.user?.studentRegNo ?? "";
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

  const openConversation = useMutation(
    trpc.chat.openConversation.mutationOptions({
      onSuccess: () => navigate("/chat"),
    }),
  );

  function handleSubmitRequest(counsellor: DBCounsellor, reason: string) {
    createAppointment.mutate({
      studentRegNo: regNo,
      counsellorEmail: counsellor.email,
      reason,
    });
  }

  function handleOpenChat(counsellorEmail: string) {
    openConversation.mutate({ withId: counsellorEmail });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF2EF] text-[#3F5A4E]">
          <CalendarClock className="h-5.5 w-5.5" strokeWidth={2} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Book a counsellor
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Counsellors available through {institution?.name}
          </p>
        </div>
      </div>

      {applications.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
            <Sparkles className="h-4 w-4 text-neutral-400" strokeWidth={2} />
            Your applications
          </h2>

          <div className="flex flex-col gap-2.5">
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
                  onClick={() => handleOpenChat(application.counsellorId)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 hover:shadow"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                      {(counsellor.name ?? "?").charAt(0).toUpperCase()}
                    </div>

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
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <ApplicationStatusBadge status={application.status} />
                    <ChevronRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-neutral-600">
          <Users className="h-4 w-4 text-neutral-400" strokeWidth={2} />
          Available counsellors
        </h2>

        {counsellorsLoading ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading counsellors...
          </div>
        ) : availableCounsellors?.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 px-4 py-10 text-center">
            <Users className="h-6 w-6 text-neutral-300" strokeWidth={1.75} />
            <p className="text-sm text-neutral-500">
              No counsellors are currently available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableCounsellors?.map((counsellor) => {
              const activeApplication = activeApplicationByCounsellor.get(
                counsellor.email,
              );

              return (
                <CounsellorCard
                  key={counsellor.email}
                  counsellor={counsellor}
                  activeApplication={activeApplication}
                  onRequest={() => setBookingTarget(counsellor)}
                  onOpenChat={() => handleOpenChat(counsellor.email)}
                />
              );
            })}
          </div>
        )}
      </section>

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
