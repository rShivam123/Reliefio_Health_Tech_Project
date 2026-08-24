"use client";

import { useState, useEffect, useCallback } from "react";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { getMyPrescriptions } from "@/services/prescriptionServices";
import { Prescription } from "@/types/prescription";

export default function PhysicianPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await getMyPrescriptions(query);
      setPrescriptions(res.data || []);
    } catch {
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchData(search || undefined), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchData]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
      <p className="text-gray-500 mt-1">All prescriptions you&apos;ve issued to patients.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by patient name..."
        className="mt-6 w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <EmptyState icon="💊" title="No prescriptions yet." message="Prescriptions you create during consultations will show up here." />
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => {
              const patient = rx.patient as { firstName: string; lastName: string };
              return (
                <div key={rx._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(rx.date).toLocaleDateString()}</p>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {rx.medicines.map((m, i) => (
                      <li key={i}>
                        <span className="font-medium">{m.name}</span> - {m.dosage}, {m.frequency}, {m.duration}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
