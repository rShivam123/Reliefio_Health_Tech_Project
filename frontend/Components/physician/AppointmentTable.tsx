"use client";

import { useState } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import Spinner from "@/Components/shared/Spinner";
import { Appointment, AppointmentPatient } from "@/types/appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  busyId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string, date: string, time: string) => void;
}

export default function AppointmentTable({
  appointments,
  busyId,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onReschedule,
}: AppointmentTableProps) {
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const submitReschedule = (id: string) => {
    if (!newDate || !newTime) return;
    onReschedule(id, newDate, newTime);
    setRescheduleId(null);
    setNewDate("");
    setNewTime("");
  };

  return (
    <div className="space-y-3">
      {appointments.map((appt) => {
        const patient = appt.patient as AppointmentPatient;
        const isBusy = busyId === appt._id;

        return (
          <div key={appt._id} className="rounded-xl border border-gray-100 p-4 hover:border-blue-100 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">
                    {patient?.firstName} {patient?.lastName}
                  </p>
                  <Badge label={appt.status} tone={statusTone(appt.status)} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {appt.date} at {appt.time} &middot; {appt.consultationType}
                </p>
                <p className="text-sm text-gray-600 mt-1">{appt.reason}</p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                {appt.status === "Pending" && (
                  <>
                    <button
                      disabled={isBusy}
                      onClick={() => onAccept(appt._id)}
                      className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isBusy && <Spinner className="w-3 h-3" />} Accept
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={() => onReject(appt._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setRescheduleId(rescheduleId === appt._id ? null : appt._id)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {appt.status === "Confirmed" && (
                  <>
                    <Link
                      href={`/physician/appointments/${appt._id}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      Start Consultation
                    </Link>
                    <button
                      disabled={isBusy}
                      onClick={() => onComplete(appt._id)}
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => setRescheduleId(rescheduleId === appt._id ? null : appt._id)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Reschedule
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={() => onCancel(appt._id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {(appt.status === "Completed" || appt.status === "Cancelled") && (
                  <Link
                    href={`/physician/appointments/${appt._id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>

            {rescheduleId === appt._id && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => submitReschedule(appt._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
