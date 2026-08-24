"use client";

import { useState, useEffect } from "react";
import { LabTest } from "@/types/lab";
import Spinner from "@/Components/shared/Spinner";
import { createLabOrder, searchLabPatients, PatientSearchResult } from "@/services/labServices";

interface CreateOrderModalProps {
  tests: LabTest[];
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateOrderModal({ tests, onClose, onCreated }: CreateOrderModalProps) {
  const [mode, setMode] = useState<"registered" | "walkin">("registered");

  // Registered-patient search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);

  // Walk-in fields
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "registered" || selectedPatient) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(() => {
      searchLabPatients(query)
        .then((res) => setResults(res.data || []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, mode, selectedPatient]);

  const toggleTest = (id: string) => {
    setSelectedTests((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const total = tests.filter((t) => selectedTests.includes(t._id)).reduce((sum, t) => sum + t.price, 0);

  const handleSubmit = async () => {
    if (mode === "registered" && !selectedPatient) {
      setError("Search for and select a registered patient, or switch to Walk-in.");
      return;
    }
    if (mode === "walkin" && (!patientName || !patientPhone)) {
      setError("Patient name and phone are required.");
      return;
    }
    if (selectedTests.length === 0) {
      setError("Select at least one test.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createLabOrder({
        patientId: mode === "registered" ? selectedPatient?._id : undefined,
        walkInPatient: mode === "walkin" ? { name: patientName, phone: patientPhone } : undefined,
        testIds: selectedTests,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none">
          &times;
        </button>

        <h3 className="text-lg font-bold text-gray-900">New Lab Order</h3>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              setMode("registered");
              setError("");
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
              mode === "registered" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Registered Patient
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("walkin");
              setError("");
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${
              mode === "walkin" ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Walk-in Patient
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {mode === "registered" ? (
            selectedPatient ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedPatient.phone} &middot; {selectedPatient.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setQuery("");
                  }}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search by name, phone or email</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Start typing to search..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {searching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                {results.length > 0 && (
                  <div className="mt-2 border border-gray-100 rounded-lg divide-y divide-gray-50 max-h-40 overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        onClick={() => setSelectedPatient(p)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-800">
                          {p.firstName} {p.lastName}
                        </span>{" "}
                        <span className="text-gray-500">&middot; {p.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                {!searching && query.trim().length >= 2 && results.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No matching registered patients. Try Walk-in instead.</p>
                )}
              </div>
            )
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Tests</label>
            <div className="max-h-56 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-3">
              {tests.length === 0 ? (
                <p className="text-sm text-gray-400">No active tests. Add tests first.</p>
              ) : (
                tests.map((t) => (
                  <label key={t._id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedTests.includes(t._id)} onChange={() => toggleTest(t._id)} />
                      {t.name}
                    </span>
                    <span className="text-gray-500">₹{t.price}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-semibold text-gray-800 border-t border-gray-100 pt-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {submitting && <Spinner />}
            {submitting ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
