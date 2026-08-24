"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatsCard from "@/Components/physician/StatsCard";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonStat, SkeletonRow } from "@/Components/shared/Skeleton";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { getLabDashboard, LabDashboard } from "@/services/labServices";

export default function LabDashboardPage() {
  const [data, setData] = useState<LabDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLabDashboard()
      .then((res) => setData(res.data || null))
      .catch((err) => setError(err?.response?.data?.message || "Could not load your dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{data?.labName || "Lab Dashboard"}</h1>
      <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening across your lab today.</p>

      {error && (
        <div className="mt-6">
          <EmptyState
            icon="⚠️"
            title="No lab profile yet"
            message={error}
            action={
              <Link href="/lab/profile" className="px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                Complete Lab Profile
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
                <StatsCard label="Total Orders" value={data?.totalOrders ?? 0} icon="🧾" tone="blue" />
                <StatsCard label="Pending Samples" value={data?.pendingSamples ?? 0} icon="🧪" tone="yellow" />
                <StatsCard label="Processing" value={data?.processing ?? 0} icon="⚗️" tone="purple" />
                <StatsCard label="Reports Pending" value={data?.reportsPending ?? 0} icon="📄" tone="orange" />
                <StatsCard label="Reports Completed" value={data?.reportsCompleted ?? 0} icon="✅" tone="green" />
                <StatsCard label="Today's Revenue" value={`₹${data?.todaysRevenue ?? 0}`} icon="💰" tone="blue" />
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Orders</h2>
                <Link href="/lab/orders" className="text-sm text-orange-600 font-medium hover:underline">
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              ) : !data?.recentOrders?.length ? (
                <EmptyState icon="🧾" title="No orders yet." />
              ) : (
                <div className="space-y-3">
                  {data.recentOrders.map((order) => {
                    const patient = typeof order.patient === "object" ? order.patient : null;
                    return (
                      <Link
                        key={order._id}
                        href={`/lab/orders/${order._id}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {patient ? `${patient.firstName} ${patient.lastName}` : order.walkInPatient?.name || "Walk-in Patient"}
                          </p>
                          <p className="text-xs text-gray-500">{order.tests.length} test(s) &middot; ₹{order.totalAmount}</p>
                        </div>
                        <Badge label={order.status} tone={statusTone(order.status)} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Reports</h2>
                <Link href="/lab/reports" className="text-sm text-orange-600 font-medium hover:underline">
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              ) : !data?.recentReports?.length ? (
                <EmptyState icon="📄" title="No reports yet." />
              ) : (
                <div className="space-y-3">
                  {data.recentReports.map((report) => (
                    <Link
                      key={report._id}
                      href={`/lab/reports/${report._id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{report.patientName}</p>
                        <p className="text-xs text-gray-500">{report.tests.map((t) => t.testName).join(", ")}</p>
                      </div>
                      <Badge label={report.verificationStatus} tone={statusTone(report.verificationStatus)} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
