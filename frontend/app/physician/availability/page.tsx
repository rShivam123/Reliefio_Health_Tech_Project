"use client";

import { useState, useEffect } from "react";
import AvailabilityForm from "@/Components/physician/AvailabilityForm";
import { Skeleton } from "@/Components/shared/Skeleton";
import { useToast } from "@/Components/shared/ToastProvider";
import { getPhysicianAvailability, updatePhysicianAvailability } from "@/services/physicianServices";
import { WorkingDay } from "@/types/doctor";

export default function PhysicianAvailabilityPage() {
  const { showToast } = useToast();
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
  const [slotDuration, setSlotDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPhysicianAvailability()
      .then((res) => {
        setWorkingDays(res.data?.workingDays || []);
        setSlotDuration(res.data?.slotDuration || 30);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to load availability."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePhysicianAvailability({ workingDays, slotDuration });
      showToast("Availability updated successfully.", "success");
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update availability.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 max-w-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
      <p className="text-gray-500 mt-1">
        Set your working days and hours. Patients will only be able to book appointments within these windows.
      </p>

      {error ? (
        <p className="mt-6 text-red-600 text-sm">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
          <AvailabilityForm
            workingDays={workingDays}
            slotDuration={slotDuration}
            onChange={setWorkingDays}
            onSlotDurationChange={setSlotDuration}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition"
          >
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      )}
    </div>
  );
}
