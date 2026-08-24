"use client";

import { useState, useEffect, useCallback } from "react";
import AppointmentTable from "@/Components/physician/AppointmentTable";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { useToast } from "@/Components/shared/ToastProvider";
import { getPhysicianAppointments } from "@/services/physicianServices";
import { updateAppointment } from "@/services/appointmentServices";
import { Appointment } from "@/types/appointment";

const SCOPES: { value: "today" | "upcoming" | "past" | ""; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "", label: "All" },
];

export default function PhysicianAppointmentsPage() {
  const { showToast } = useToast();
  const [scope, setScope] = useState<"today" | "upcoming" | "past" | "">("today");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPhysicianAppointments(scope ? { scope } : undefined);
      setAppointments(res.data || []);
    } catch {
      showToast("Failed to load appointments.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const runAction = async (id: string, action: () => Promise<unknown>, successMessage: string) => {
    setBusyId(id);
    try {
      await action();
      showToast(successMessage, "success");
      await fetchAppointments();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Action failed.";
      showToast(message, "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
      <p className="text-gray-500 mt-1">Manage your appointment requests and schedule.</p>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
        {SCOPES.map((s) => (
          <button
            key={s.value}
            onClick={() => setScope(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              scope === s.value ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState icon="📅" title="No appointments found." message="There are no appointments in this view." />
        ) : (
          <AppointmentTable
            appointments={appointments}
            busyId={busyId}
            onAccept={(id) => runAction(id, () => updateAppointment(id, { status: "Confirmed" }), "Appointment accepted.")}
            onReject={(id) => runAction(id, () => updateAppointment(id, { status: "Cancelled" }), "Appointment rejected.")}
            onComplete={(id) => runAction(id, () => updateAppointment(id, { status: "Completed" }), "Appointment marked completed.")}
            onCancel={(id) => runAction(id, () => updateAppointment(id, { status: "Cancelled" }), "Appointment cancelled.")}
            onReschedule={(id, date, time) =>
              runAction(id, () => updateAppointment(id, { date, time }), "Appointment rescheduled.")
            }
          />
        )}
      </div>
    </div>
  );
}
