"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { Skeleton } from "@/Components/shared/Skeleton";
import EmptyState from "@/Components/shared/EmptyState";
import PrescriptionForm from "@/Components/physician/PrescriptionForm";
import { useToast } from "@/Components/shared/ToastProvider";
import { getAppointmentById } from "@/services/appointmentServices";
import {
  createOrUpdateConsultation,
  getConsultationByAppointment,
  updateConsultation,
} from "@/services/consultationServices";
import { createPrescription } from "@/services/prescriptionServices";
import { getPhysicianPatientDetail } from "@/services/physicianServices";
import { Appointment, AppointmentPatient } from "@/types/appointment";
import { Consultation } from "@/types/consultation";
import { Prescription, Medicine } from "@/types/prescription";

export default function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingRx, setSubmittingRx] = useState(false);
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const apptRes = await getAppointmentById(id);
      const appt = apptRes.data || null;
      setAppointment(appt);

      const consultRes = await getConsultationByAppointment(id);
      if (consultRes.data) {
        setConsultation(consultRes.data);
        setDiagnosis(consultRes.data.diagnosis || "");
        setNotes(consultRes.data.notes || "");
      }

      const patientId = typeof appt?.patient === "string" ? appt.patient : (appt?.patient as AppointmentPatient)?._id;
      if (patientId) {
        const detailRes = await getPhysicianPatientDetail(patientId);
        setPrescriptions(detailRes.data?.prescriptions || []);
      }
    } catch {
      showToast("Failed to load consultation.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveConsultation = async (): Promise<Consultation | null> => {
    try {
      setSaving(true);
      const res = await createOrUpdateConsultation({ appointmentId: id, diagnosis, notes });
      if (res.data) {
        setConsultation(res.data);
        showToast("Consultation notes saved.", "success");
        return res.data;
      }
      return null;
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save.";
      showToast(message, "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    let current = consultation;
    if (!current) current = await handleSaveConsultation();
    if (!current) return;

    try {
      setCompleting(true);
      await updateConsultation(current._id, { markCompleted: true });
      showToast("Consultation marked as completed.", "success");
      await load();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to complete.";
      showToast(message, "error");
    } finally {
      setCompleting(false);
    }
  };

  const handleCreatePrescription = async (medicines: Medicine[]) => {
    let current = consultation;
    if (!current) current = await handleSaveConsultation();
    if (!current) {
      showToast("Please save diagnosis/notes before creating a prescription.", "error");
      return;
    }

    const patientId = typeof appointment?.patient === "string" ? appointment.patient : (appointment?.patient as AppointmentPatient)?._id;
    if (!patientId) return;

    try {
      setSubmittingRx(true);
      await createPrescription({
        patientId,
        consultationId: current._id,
        appointmentId: id,
        medicines,
      });
      showToast("Prescription created successfully.", "success");
      await load();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create prescription.";
      showToast(message, "error");
    } finally {
      setSubmittingRx(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!appointment) {
    return <EmptyState icon="🩺" title="Appointment not found" message="This appointment may have been removed." />;
  }

  const patient = appointment.patient as AppointmentPatient;

  return (
    <div className="max-w-4xl">
      <Link href="/physician/appointments" className="text-sm text-blue-600 hover:underline font-medium">
        &larr; Back to Appointments
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {patient?.firstName} {patient?.lastName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {appointment.date} at {appointment.time} &middot; {appointment.consultationType}
            </p>
            <p className="text-gray-600 text-sm mt-1">Reason: {appointment.reason}</p>
          </div>
          <Badge label={appointment.status} tone={statusTone(appointment.status)} />
        </div>

        {(patient?.allergies?.length || patient?.currentMedications?.length) ? (
          <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
            {!!patient?.allergies?.length && (
              <div className="bg-red-50 rounded-xl p-3">
                <p className="font-semibold text-red-700">Allergies</p>
                <p className="text-red-600 mt-1">{patient.allergies.join(", ")}</p>
              </div>
            )}
            {!!patient?.currentMedications?.length && (
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="font-semibold text-yellow-700">Current Medications</p>
                <p className="text-yellow-700 mt-1">{patient.currentMedications.join(", ")}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="font-bold text-gray-900">Diagnosis &amp; Notes</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
              placeholder="e.g. Acute bronchitis"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Physician Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Clinical observations, recommendations, follow-up plan..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveConsultation}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition"
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>

            {appointment.status !== "Completed" && (
              <button
                onClick={handleMarkCompleted}
                disabled={completing}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg text-sm font-semibold transition"
              >
                {completing ? "Completing..." : "Mark Consultation Completed"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="font-bold text-gray-900">New Prescription</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">Add one or more medicines for this patient.</p>
        <PrescriptionForm onSubmit={handleCreatePrescription} submitting={submittingRx} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6 mb-10">
        <h2 className="font-bold text-gray-900">Previous Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No prior prescriptions for this patient.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx._id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-400">{new Date(rx.date).toLocaleDateString()}</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {rx.medicines.map((m, i) => (
                    <li key={i}>
                      <span className="font-medium">{m.name}</span> - {m.dosage}, {m.frequency}, {m.duration}
                      {m.instructions ? ` (${m.instructions})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
