"use client";

import { useState } from "react";
import { LabTest } from "@/types/lab";
import Spinner from "@/Components/shared/Spinner";

interface TestFormProps {
  initial?: LabTest;
  onSubmit: (payload: Partial<LabTest>) => Promise<void>;
  onClose: () => void;
}

const emptyForm = {
  name: "",
  category: "General",
  price: 0,
  sampleType: "Blood",
  turnaroundTime: "24 hours",
  preparationInstructions: "No special preparation required.",
};

export default function TestForm({ initial, onSubmit, onClose }: TestFormProps) {
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          category: initial.category,
          price: initial.price,
          sampleType: initial.sampleType,
          turnaroundTime: initial.turnaroundTime,
          preparationInstructions: initial.preparationInstructions,
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.sampleType || form.price < 0) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none">
          &times;
        </button>

        <h3 className="text-lg font-bold text-gray-900">{initial ? "Edit Test" : "Add New Test"}</h3>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Complete Blood Count (CBC)"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
              <input
                value={form.sampleType}
                onChange={(e) => setForm({ ...form, sampleType: e.target.value })}
                placeholder="Blood / Urine / Swab"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turnaround Time</label>
              <input
                value={form.turnaroundTime}
                onChange={(e) => setForm({ ...form, turnaroundTime: e.target.value })}
                placeholder="e.g. 6 hours"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Instructions</label>
            <textarea
              value={form.preparationInstructions}
              onChange={(e) => setForm({ ...form, preparationInstructions: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {submitting && <Spinner />}
            {submitting ? "Saving..." : initial ? "Save Changes" : "Add Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
