"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { Skeleton } from "@/Components/shared/Skeleton";
import EmptyState from "@/Components/shared/EmptyState";
import { getPhysicianPatientDetail } from "@/services/physicianServices";
import { Appointment } from "@/types/appointment";
import { Consultation } from "@/types/consultation";
import { Prescription } from "@/types/prescription";
import { LabReport } from "@/types/lab";

interface PatientDetailData {
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    allergies?: string[];
    currentMedications?: string[];
  };
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  labReports: LabReport[];
}

export default function PhysicianPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<PatientDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPhysicianPatientDetail(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Could not load this patient."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState icon="🧑‍🤝‍🧑" title="Patient not found" message={error || "This patient could not be loaded."} />;
  }

  const { patient, appointments, consultations, prescriptions, labReports } = data;

  return (
    <div className="max-w-4xl">
      <Link href="/physician/patients" className="text-sm text-blue-600 hover:underline font-medium">
        &larr; Back to Patients
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
            {patient.firstName?.[0]?.toUpperCase()}
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              {patient.email} &middot; {patient.phone}
            </p>
          </div>
        </div>

        <dl className="grid sm:grid-cols-3 gap-4 mt-5 text-sm">
          <div>
            <dt className="text-gray-400">Gender</dt>
            <dd className="text-gray-800 font-medium">{patient.gender || "-"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Blood Group</dt>
            <dd className="text-gray-800 font-medium">{patient.bloodGroup || "-"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Date of Birth</dt>
            <dd className="text-gray-800 font-medium">
              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "-"}
            </dd>
          </div>
        </dl>

        {(patient.allergies?.length || patient.currentMedications?.length) ? (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {!!patient.allergies?.length && (
              <div className="bg-red-50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-red-700">Allergies</p>
                <p className="text-red-600 mt-1">{patient.allergies.join(", ")}</p>
              </div>
            )}
            {!!patient.currentMedications?.length && (
              <div className="bg-yellow-50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-yellow-700">Current Medications</p>
                <p className="text-yellow-700 mt-1">{patient.currentMedications.join(", ")}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Appointment history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="font-bold text-gray-900">Appointment History</h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No appointments yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {appointments.map((a) => (
              <Link
                key={a._id}
                href={`/physician/appointments/${a._id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition text-sm"
              >
                <span className="text-gray-700">
                  {a.date} at {a.time} &middot; {a.reason}
                </span>
                <Badge label={a.status} tone={statusTone(a.status)} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Diagnosis history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="font-bold text-gray-900">Diagnosis History &amp; Physician Notes</h2>
        {consultations.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No consultation records yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {consultations.map((c) => (
              <div key={c._id} className="border border-gray-100 rounded-xl p-4 text-sm">
                <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                {c.diagnosis && (
                  <p className="mt-1">
                    <span className="font-semibold text-gray-700">Diagnosis: </span>
                    {c.diagnosis}
                  </p>
                )}
                {c.notes && (
                  <p className="mt-1">
                    <span className="font-semibold text-gray-700">Notes: </span>
                    {c.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescriptions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="font-bold text-gray-900">Previous Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No prescriptions yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx._id} className="border border-gray-100 rounded-xl p-4 text-sm">
                <p className="text-xs text-gray-400">{new Date(rx.date).toLocaleDateString()}</p>
                <ul className="mt-2 space-y-1 text-gray-700">
                  {rx.medicines.map((m, i) => (
                    <li key={i}>
                      <span className="font-medium">{m.name}</span> - {m.dosage}, {m.frequency}, {m.duration}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lab reports */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6 mb-10">
        <h2 className="font-bold text-gray-900">Lab Reports</h2>
        {labReports.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No published lab reports yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {labReports.map((r) => (
              <Link
                key={r._id}
                href={`/reports/${r._id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition text-sm"
              >
                <span className="text-gray-700">
                  {r.tests.map((t) => t.testName).join(", ")}
                </span>
                <span className="text-gray-400 text-xs">
                  {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
