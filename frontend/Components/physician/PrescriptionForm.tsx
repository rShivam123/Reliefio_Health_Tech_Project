"use client";

import { useState } from "react";
import { Medicine } from "@/types/prescription";
import Spinner from "@/Components/shared/Spinner";

const emptyMedicine = (): Medicine => ({ name: "", dosage: "", frequency: "", duration: "", instructions: "" });

interface PrescriptionFormProps {
  onSubmit: (medicines: Medicine[]) => Promise<void>;
  submitting: boolean;
}

export default function PrescriptionForm({ onSubmit, submitting }: PrescriptionFormProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()]);

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const addMedicine = () => setMedicines((prev) => [...prev, emptyMedicine()]);
  const removeMedicine = (index: number) => setMedicines((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const valid = medicines.filter((m) => m.name && m.dosage && m.frequency && m.duration);
    if (valid.length === 0) return;
    await onSubmit(valid);
    setMedicines([emptyMedicine()]);
  };

  return (
    <div className="space-y-4">
      {medicines.map((m, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start bg-gray-50 rounded-xl p-4">
          <input
            placeholder="Medicine"
            value={m.name}
            onChange={(e) => updateMedicine(i, "name", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            placeholder="Dosage (e.g. 500mg)"
            value={m.dosage}
            onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            placeholder="Frequency (e.g. Twice daily)"
            value={m.frequency}
            onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            placeholder="Duration (e.g. 5 days)"
            value={m.duration}
            onChange={(e) => updateMedicine(i, "duration", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <div className="flex gap-2">
            <input
              placeholder="Instructions"
              value={m.instructions}
              onChange={(e) => updateMedicine(i, "instructions", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
            />
            {medicines.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedicine(i)}
                className="text-red-500 hover:text-red-700 text-lg px-1"
                aria-label="Remove medicine"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addMedicine}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          + Add another medicine
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
        >
          {submitting && <Spinner className="w-4 h-4" />}
          {submitting ? "Saving..." : "Create Prescription"}
        </button>
      </div>
    </div>
  );
}
