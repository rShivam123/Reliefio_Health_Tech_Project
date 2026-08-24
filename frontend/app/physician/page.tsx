"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/Components/physician/StatsCard";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonStat, SkeletonRow } from "@/Components/shared/Skeleton";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { getPhysicianDashboard, PhysicianDashboard } from "@/services/physicianServices";
import { useAuth } from "@/Components/shared/AuthProvider";
import { AppointmentPatient } from "@/types/appointment";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function PhysicianDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PhysicianDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPhysicianDashboard()
      .then((res) => setData(res.data || null))
      .catch((err) => {
        setError(err?.response?.data?.message || "Could not load your dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {greeting()}, Dr. {user?.lastName || data?.doctorName?.split(" ").slice(1).join(" ") || ""}
      </h1>
      <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your practice today.</p>

      {error && (
        <div className="mt-6">
          <EmptyState
            icon="⚠️"
            title="No physician profile yet"
            message={error}
            action={
              <Link href="/physician/profile" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Complete Your Profile
              </Link>
            }
          />
        </div>
      )}

      {!error && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonStat key={i} />)
            ) : (
              <>
                <StatsCard label="Today's Appointments" value={data?.todaysAppointmentCount ?? 0} icon="📅" tone="blue" />
                <StatsCard label="Pending Appointments" value={data?.pendingAppointments ?? 0} icon="⏳" tone="yellow" />
                <StatsCard label="Completed Consultations" value={data?.completedConsultations ?? 0} icon="✅" tone="green" />
                <StatsCard label="Total Patients" value={data?.totalPatients ?? 0} icon="🧑‍🤝‍🧑" tone="purple" />
                <StatsCard label="Today's Earnings" value={`₹${data?.todaysEarnings ?? 0}`} icon="💰" tone="orange" />
                <StatsCard label="Unread Notifications" value={data?.unreadNotifications ?? 0} icon="🔔" tone="blue" />
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-8 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Today&apos;s Appointments</h2>
              <Link href="/physician/appointments" className="text-sm text-blue-600 font-medium hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : !data?.todaysAppointments?.length ? (
              <EmptyState icon="📅" title="No appointments scheduled." message="You have no appointments booked for today." />
            ) : (
              <div className="space-y-3">
                {data.todaysAppointments.map((appt) => {
                  const patient = appt.patient as AppointmentPatient;
                  return (
                    <Link
                      key={appt._id}
                      href={`/physician/appointments/${appt._id}`}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {patient?.firstName} {patient?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appt.time} &middot; {appt.consultationType} &middot; {appt.reason}
                        </p>
                      </div>
                      <Badge label={appt.status} tone={statusTone(appt.status)} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
