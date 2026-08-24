"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Badge, { statusTone } from "@/Components/shared/Badge";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import ReviewModal from "@/Components/doctors/ReviewModal";
import { useAuth } from "@/Components/shared/AuthProvider";
import { useToast } from "@/Components/shared/ToastProvider";
import { getMyAppointments, updateAppointment } from "@/services/appointmentServices";
import { getMyReviews } from "@/services/reviewServices";
import { Appointment } from "@/types/appointment";
import { Doctor, Review } from "@/types/doctor";

const TABS: { value: "upcoming" | "past" | ""; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "", label: "All" },
];

export default function MyAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [scope, setScope] = useState<"upcoming" | "past" | "">("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{ appointmentId: string; doctorName: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, reviewRes] = await Promise.all([
        getMyAppointments(scope ? { scope } : undefined),
        getMyReviews(),
      ]);
      setAppointments(apptRes.data || []);
      setReviews(reviewRes.data || []);
    } catch {
      showToast("Failed to load your appointments.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  useEffect(() => {
    if (!authLoading && user) load();
  }, [authLoading, user, load]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this appointment?")) return;
    setBusyId(id);
    try {
      await updateAppointment(id, { status: "Cancelled" });
      showToast("Appointment cancelled.", "success");
      await load();
    } catch {
      showToast("Failed to cancel appointment.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const reviewFor = (appointmentId: string) => reviews.find((r) => r.appointment === appointmentId);

  if (!authLoading && !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-20">
          <EmptyState
            icon="🔒"
            title="Please log in"
            message="Log in to see your appointments."
            action={
              <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Log In
              </Link>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Everything you&apos;ve booked with doctors on Reliefio.</p>

          <div className="flex gap-2 mt-6">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setScope(t.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  scope === t.value ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No appointments scheduled."
                message="Browse doctors and book your first appointment."
                action={
                  <Link href="/doctors" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    Find a Doctor
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => {
                  const doctor = appt.doctor as Doctor;
                  const existingReview = reviewFor(appt._id);
                  const isBusy = busyId === appt._id;

                  return (
                    <div key={appt._id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-blue-50 overflow-hidden shrink-0">
                            <Image
                              src={doctor?.profileImage || "/doctor.png"}
                              alt={doctor?.name || "Doctor"}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-800 truncate">{doctor?.name}</p>
                              <Badge label={appt.status} tone={statusTone(appt.status)} />
                            </div>
                            <p className="text-sm text-gray-500">{doctor?.specialty}</p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {appt.date} at {appt.time} &middot; {appt.consultationType}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                          {(appt.status === "Pending" || appt.status === "Confirmed") && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleCancel(appt._id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          {appt.status === "Completed" && !existingReview && (
                            <button
                              onClick={() => setReviewTarget({ appointmentId: appt._id, doctorName: doctor?.name || "your doctor" })}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                            >
                              Leave a Review
                            </button>
                          )}
                        </div>
                      </div>

                      {existingReview && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                          <span className="text-yellow-500">{"⭐".repeat(existingReview.rating)}</span>
                          {existingReview.comment && <p className="text-gray-600 mt-1">{existingReview.comment}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {reviewTarget && (
        <ReviewModal
          appointmentId={reviewTarget.appointmentId}
          doctorName={reviewTarget.doctorName}
          onClose={() => setReviewTarget(null)}
          onSubmitted={load}
        />
      )}
    </>
  );
}
