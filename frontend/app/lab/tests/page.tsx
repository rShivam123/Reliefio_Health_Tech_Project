"use client";

import { useState, useEffect, useCallback } from "react";
import TestForm from "@/Components/lab/TestForm";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { useToast } from "@/Components/shared/ToastProvider";
import { getLabTests, createLabTest, updateLabTest, deleteLabTest } from "@/services/labServices";
import { LabTest } from "@/types/lab";

export default function LabTestsPage() {
  const { showToast } = useToast();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | undefined>(undefined);

  const fetchTests = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const res = await getLabTests(query);
      setTests(res.data || []);
    } catch {
      showToast("Failed to load tests.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchTests(search || undefined), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchTests]);

  const handleCreate = async (payload: Partial<LabTest>) => {
    await createLabTest(payload);
    showToast("Test added successfully.", "success");
    fetchTests(search || undefined);
  };

  const handleUpdate = async (payload: Partial<LabTest>) => {
    if (!editingTest) return;
    await updateLabTest(editingTest._id, payload);
    showToast("Test updated successfully.", "success");
    fetchTests(search || undefined);
  };

  const handleDelete = async (test: LabTest) => {
    if (!confirm(`Deactivate "${test.name}"? Patients will no longer be able to order it.`)) return;
    try {
      await deleteLabTest(test._id);
      showToast("Test deactivated.", "success");
      fetchTests(search || undefined);
    } catch {
      showToast("Failed to deactivate test.", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
          <p className="text-gray-500 mt-1">Manage the diagnostic tests your lab offers.</p>
        </div>
        <button
          onClick={() => {
            setEditingTest(undefined);
            setShowForm(true);
          }}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition"
        >
          + Add Test
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tests..."
        className="mt-6 w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <EmptyState icon="🔬" title="No tests added yet." message="Add your first diagnostic test to start accepting orders." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Test Name</th>
                  <th className="pb-2 font-medium">Sample</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Turnaround</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-gray-800">{t.name}</td>
                    <td className="py-3 text-gray-600">{t.sampleType}</td>
                    <td className="py-3 text-gray-600">₹{t.price}</td>
                    <td className="py-3 text-gray-600">{t.turnaroundTime}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingTest(t);
                          setShowForm(true);
                        }}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Edit
                      </button>
                      {t.isActive && (
                        <button onClick={() => handleDelete(t)} className="text-red-600 font-medium hover:underline">
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <TestForm
          initial={editingTest}
          onSubmit={editingTest ? handleUpdate : handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
