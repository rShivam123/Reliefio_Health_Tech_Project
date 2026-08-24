"use client";

import { useState, useEffect, useCallback } from "react";
import PatientTable from "@/Components/physician/PatientTable";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { getPhysicianPatients, PhysicianPatient } from "@/services/physicianServices";

export default function PhysicianPatientsPage() {
  const [patients, setPatients] = useState<PhysicianPatient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await getPhysicianPatients(query);
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
      <p className="text-gray-500 mt-1">Everyone who has booked an appointment with you.</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients by name, email or phone..."
        className="mt-6 w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <EmptyState icon="🧑‍🤝‍🧑" title="No patients yet." message="Patients will appear here once they book an appointment with you." />
        ) : (
          <PatientTable patients={patients} />
        )}
      </div>
    </div>
  );
}
