"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Badge, { statusTone } from "@/Components/shared/Badge";
import EmptyState from "@/Components/shared/EmptyState";
import { SkeletonRow } from "@/Components/shared/Skeleton";
import { useAuth } from "@/Components/shared/AuthProvider";
import { getMyLabOrders, MyLabOrder } from "@/services/labServices";

export default function MyLabOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<MyLabOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    getMyLabOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  if (!authLoading && !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-20">
          <EmptyState
            icon="🔒"
            title="Please log in"
            message="Log in to see your lab orders."
            action={
              <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Log In
              </Link>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Lab Orders</h1>
          <p className="text-gray-500 mt-1">Diagnostic tests ordered under your account, across every lab.</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 p-5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                icon="🧪"
                title="No lab orders yet."
                message="Orders placed for you by a lab or referring doctor will show up here."
              />
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const lab = typeof order.lab === "object" ? order.lab : null;
                  return (
                    <div key={order._id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800">{lab?.labName || "Diagnostic Lab"}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{order.tests.map((t) => t.name).join(", ")}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Ordered {new Date(order.createdAt).toLocaleDateString()} &middot; ₹{order.totalAmount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge label={order.status} tone={statusTone(order.status)} />
                          {order.report?.verificationStatus === "Published" && (
                            <Link
                              href={`/reports/${order.report._id}`}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                            >
                              View Report
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
