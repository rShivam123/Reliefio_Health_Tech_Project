"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { Skeleton } from "@/Components/shared/Skeleton";
import EmptyState from "@/Components/shared/EmptyState";
import { useToast } from "@/Components/shared/ToastProvider";
import { getLabOrderById, updateLabOrder, createLabSample, createLabReport } from "@/services/labServices";
import { LabOrder, LabOrderStatus } from "@/types/lab";

const STATUS_FLOW: LabOrderStatus[] = ["Pending", "Sample Collection", "Sample Received", "Processing", "Completed"];

export default function LabOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [order, setOrder] = useState<LabOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    getLabOrderById(id)
      .then((res) => setOrder(res.data || null))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      setUpdating(true);
      await updateLabOrder(id, { status });
      showToast(`Order status updated to "${status}".`, "success");
      load();
    } catch {
      showToast("Failed to update status.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await updateLabOrder(id, { paymentStatus: "Paid" });
      showToast("Payment marked as received.", "success");
      load();
    } catch {
      showToast("Failed to update payment status.", "error");
    }
  };

  const handleRegisterSample = async () => {
    try {
      await createLabSample({ orderId: id });
      showToast("Sample registered successfully.", "success");
      load();
    } catch {
      showToast("Failed to register sample.", "error");
    }
  };

  const handleCreateReport = async () => {
    try {
      const res = await createLabReport(id);
      showToast("Report draft created.", "success");
      if (res.data?._id) router.push(`/lab/reports/${res.data._id}`);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create report.";
      showToast(message, "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return <EmptyState icon="🧾" title="Order not found" message="This order may have been removed." />;
  }

  const patient = typeof order.patient === "object" ? order.patient : null;
  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="max-w-3xl">
      <Link href="/lab/orders" className="text-sm text-orange-600 hover:underline font-medium">
        &larr; Back to Orders
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {patient ? `${patient.firstName} ${patient.lastName}` : order.walkInPatient?.name || "Walk-in Patient"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {patient?.phone || order.walkInPatient?.phone} &middot; Order #{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge label={order.status} tone={statusTone(order.status)} />
            <Badge label={order.paymentStatus} tone={statusTone(order.paymentStatus)} />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">Tests Ordered</p>
          <div className="space-y-1">
            {order.tests.map((t, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-600">
                <span>{t.name}</span>
                <span>₹{t.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 mt-2 pt-2">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {order.status !== "Cancelled" && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s, i) => (
                <button
                  key={s}
                  disabled={updating || i <= currentIndex}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:cursor-not-allowed ${
                    i <= currentIndex ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                disabled={updating}
                onClick={() => handleStatusChange("Cancelled")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          {order.paymentStatus !== "Paid" && (
            <button onClick={handleMarkPaid} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Mark Payment Received
            </button>
          )}
          <button onClick={handleRegisterSample} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
            Register Sample
          </button>
          <button onClick={handleCreateReport} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition">
            Create Report
          </button>
        </div>
      </div>
    </div>
  );
}
