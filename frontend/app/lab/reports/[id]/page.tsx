"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { Skeleton } from "@/Components/shared/Skeleton";
import EmptyState from "@/Components/shared/EmptyState";
import ReportForm from "@/Components/lab/ReportForm";
import { useToast } from "@/Components/shared/ToastProvider";
import { getLabReportById, updateLabReport } from "@/services/labServices";
import { LabReport, ReportTest, ReportVerificationStatus } from "@/types/lab";

const STATUS_FLOW: ReportVerificationStatus[] = ["Draft", "Processing", "Pending Verification", "Verified", "Published"];

export default function LabReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { showToast } = useToast();

  const [report, setReport] = useState<LabReport | null>(null);
  const [tests, setTests] = useState<ReportTest[]>([]);
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getLabReportById(id)
      .then((res) => {
        if (res.data) {
          setReport(res.data);
          setTests(res.data.tests);
          setTechnician(res.data.technician || "");
          setNotes(res.data.notes || "");
        }
      })
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSave = async (nextStatus?: ReportVerificationStatus) => {
    try {
      setSaving(true);
      const payload: Partial<LabReport> = { tests, technician, notes };
      if (nextStatus) payload.verificationStatus = nextStatus;

      const res = await updateLabReport(id, payload);
      setReport(res.data);
      showToast(nextStatus ? `Report marked as "${nextStatus}".` : "Report saved.", "success");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save report.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!report) {
    return <EmptyState icon="📄" title="Report not found" message="This report may have been removed." />;
  }

  const currentIndex = STATUS_FLOW.indexOf(report.verificationStatus);
  const labInfo = typeof report.lab === "object" ? report.lab : null;

  return (
    <div className="max-w-3xl">
      <Link href="/lab/reports" className="text-sm text-orange-600 hover:underline font-medium">
        &larr; Back to Reports
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{report.patientName}</h1>
            <p className="text-sm text-gray-500 mt-1">{labInfo?.labName}</p>
          </div>
          <Badge label={report.verificationStatus} tone={statusTone(report.verificationStatus)} />
        </div>

        {report.verificationStatus === "Published" && (
          <Link href={`/reports/${report._id}`} className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium">
            View published report &rarr;
          </Link>
        )}

        <div className="mt-6">
          <h2 className="font-bold text-gray-900 mb-3">Test Results</h2>
          <ReportForm tests={tests} onChange={setTests} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
            <input
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Technician name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Technician Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          {STATUS_FLOW.slice(currentIndex + 1).map((s) => (
            <button
              key={s}
              onClick={() => handleSave(s)}
              disabled={saving}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                s === "Published" ? "bg-green-600 text-white hover:bg-green-700" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Mark as {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
