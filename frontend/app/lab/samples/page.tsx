"use client";

import { useState, useEffect, useCallback } from "react";
import Badge, { statusTone } from "@/Components/shared/Badge";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { useToast } from "@/Components/shared/ToastProvider";
import { getLabSamples, updateLabSample } from "@/services/labServices";
import { LabSample, SampleStatus } from "@/types/lab";

const STATUS_OPTIONS: { value: SampleStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Collected", label: "Collected" },
  { value: "Received", label: "Received" },
  { value: "Processing", label: "Processing" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

export default function LabSamplesPage() {
  const { showToast } = useToast();
  const [samples, setSamples] = useState<LabSample[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchSamples = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLabSamples(statusFilter || undefined);
      setSamples(res.data || []);
    } catch {
      showToast("Failed to load samples.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  const handleStatusChange = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await updateLabSample(id, { status });
      showToast(`Sample marked as "${status}".`, "success");
      await fetchSamples();
    } catch {
      showToast("Failed to update sample.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Samples</h1>
      <p className="text-gray-500 mt-1">Track sample collection through to processing.</p>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
            statusFilter === "" ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              statusFilter === s.value ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
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
        ) : samples.length === 0 ? (
          <EmptyState icon="🧪" title="No samples found." message="Register a sample from an order to see it here." />
        ) : (
          <div className="space-y-3">
            {samples.map((s) => (
              <div key={s._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{s.patientName}</p>
                    <Badge label={s.status} tone={statusTone(s.status)} />
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">Sample type: {s.sampleType}</p>
                  {s.notes && <p className="text-sm text-gray-500 mt-0.5">Notes: {s.notes}</p>}
                </div>

                <select
                  value={s.status}
                  disabled={busyId === s._id}
                  onChange={(e) => handleStatusChange(s._id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 shrink-0"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
