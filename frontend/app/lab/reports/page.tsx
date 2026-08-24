"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { getLabReports } from "@/services/labServices";
import { LabReport, ReportVerificationStatus } from "@/types/lab";

const STATUS_OPTIONS: ReportVerificationStatus[] = ["Draft", "Processing", "Pending Verification", "Verified", "Published"];

export default function LabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLabReports(status || undefined);
      setReports(res.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      <p className="text-gray-500 mt-1">Enter results, verify and publish patient lab reports.</p>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
        <button
          onClick={() => setStatus("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
            status === "" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              status === s ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
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
        ) : reports.length === 0 ? (
          <EmptyState icon="📄" title="No laboratory reports available." message="Create a report from a completed order." />
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <Link
                key={r._id}
                href={`/lab/reports/${r._id}`}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{r.patientName}</p>
                  <p className="text-sm text-gray-500 truncate">{r.tests.map((t) => t.testName).join(", ")}</p>
                </div>
                <Badge label={r.verificationStatus} tone={statusTone(r.verificationStatus)} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
