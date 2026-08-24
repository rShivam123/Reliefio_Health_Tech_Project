"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Badge, { statusTone } from "@/Components/shared/Badge";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import CreateOrderModal from "@/Components/lab/CreateOrderModal";
import { useToast } from "@/Components/shared/ToastProvider";
import { getLabOrders, getLabTests } from "@/services/labServices";
import { LabOrder, LabTest } from "@/types/lab";

const STATUS_OPTIONS = ["", "Pending", "Sample Collection", "Sample Received", "Processing", "Completed", "Cancelled"];

export default function LabOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLabOrders({ status: status || undefined, search: search || undefined });
      setOrders(res.data || []);
    } catch {
      showToast("Failed to load orders.", "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const timeout = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timeout);
  }, [fetchOrders, search]);

  useEffect(() => {
    getLabTests()
      .then((res) => setTests((res.data || []).filter((t) => t.isActive)))
      .catch(() => setTests([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">All lab test orders, from placement to completion.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition"
        >
          + New Order
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name..."
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 flex-1 min-w-[200px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon="🧾" title="No orders found." message="Create a new order to get started." />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const patient = typeof order.patient === "object" ? order.patient : null;
              return (
                <Link
                  key={order._id}
                  href={`/lab/orders/${order._id}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {patient ? `${patient.firstName} ${patient.lastName}` : order.walkInPatient?.name || "Walk-in Patient"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {order.tests.map((t) => t.name).join(", ")} &middot; ₹{order.totalAmount}
                    </p>
                  </div>
                  <Badge label={order.status} tone={statusTone(order.status)} />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && <CreateOrderModal tests={tests} onClose={() => setShowCreate(false)} onCreated={fetchOrders} />}
    </div>
  );
}
