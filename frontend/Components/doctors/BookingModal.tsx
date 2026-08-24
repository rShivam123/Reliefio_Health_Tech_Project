"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Doctor } from "@/types/doctor";
import { getDoctorSlots } from "@/services/doctorServices";
import { createAppointment } from "@/services/appointmentServices";
import { useAuth } from "@/Components/shared/AuthProvider";
import { useToast } from "@/Components/shared/ToastProvider";
import Spinner from "@/Components/shared/Spinner";

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onBooked?: () => void;
}

function getNextDays(count: number) {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function BookingModal({ doctor, onClose, onBooked }: BookingModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [consultationType, setConsultationType] = useState(doctor.consultationModes[0] || "Online");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const days = getNextDays(14);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime("");
    getDoctorSlots(doctor._id, selectedDate)
      .then((res) => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, doctor._id]);

  const handleSubmit = async () => {
    if (!user) {
      showToast("Please log in to book an appointment.", "info");
      router.push("/login");
      return;
    }
    if (!selectedDate || !selectedTime || !reason.trim()) {
      showToast("Please select a date, time and reason for visit.", "error");
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({
        doctorId: doctor._id,
        date: selectedDate,
        time: selectedTime,
        consultationType: consultationType as "Online" | "In-Person",
        reason,
        notes,
      });
      setConfirmed(true);
      showToast("Appointment booked successfully.", "success");
      onBooked?.();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          aria-label="Close booking dialog"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        {confirmed ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              ✔
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Appointment Requested!</h3>
            <p className="text-gray-500 mt-2">
              Your appointment with {doctor.name} on {selectedDate} at {selectedTime} has been requested. You&apos;ll
              be notified once the doctor confirms.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
            <p className="text-gray-500 text-sm mt-1">
              with {doctor.name} &middot; {doctor.specialty}
            </p>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Type</label>
              <div className="flex gap-2">
                {doctor.consultationModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setConsultationType(mode)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                      consultationType === mode
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => {
                  const iso = d.toISOString().slice(0, 10);
                  const label = d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSelectedDate(iso)}
                      className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium border transition ${
                        selectedDate === iso
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time</label>
                {loadingSlots ? (
                  <p className="text-sm text-gray-400">Loading available slots...</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-gray-400">No slots available on this date. Try another day.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedTime(s)}
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${
                          selectedTime === s
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="e.g. Chest pain, routine check-up..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {submitting && <Spinner />}
              {submitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
