"use client";

import { useState, useEffect, useCallback } from "react";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { getLabPatients } from "@/services/labServices";
import { LabPatient } from "@/types/lab";

export default function LabPatientsPage() {
  const [patients, setPatients] = useState<LabPatient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await getLabPatients(query);
      setPatients(res.data || []);
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchPatients(search || undefined), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
      <p className="text-gray-500 mt-1">Everyone who has ordered a test through your lab.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients by name or phone..."
        className="mt-6 w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <EmptyState icon="🧑‍🤝‍🧑" title="No patients yet." message="Patients will appear here once they order a test." />
        ) : (
          <div className="space-y-3">
            {patients.map((p) => (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-semibold shrink-0">
                    {p.firstName?.[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{p.phone}</p>
                  </div>
                </div>

                <div className="flex gap-6 text-sm text-gray-500 shrink-0">
                  <div>
                    <p className="text-xs text-gray-400">Orders</p>
                    <p className="font-medium text-gray-700">{p.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Test</p>
                    <p className="font-medium text-gray-700">{p.lastTestDate ? new Date(p.lastTestDate).toLocaleDateString() : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Active Orders</p>
                    <p className="font-medium text-gray-700">{p.currentOrders}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
