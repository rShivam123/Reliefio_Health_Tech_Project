"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Badge, { statusTone } from "@/Components/shared/Badge";
import { Skeleton } from "@/Components/shared/Skeleton";
import EmptyState from "@/Components/shared/EmptyState";
import { useAuth } from "@/Components/shared/AuthProvider";
import { getLabReportById } from "@/services/labServices";
import { LabReport } from "@/types/lab";

export default function PublicReportViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();

  const [report, setReport] = useState<LabReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("Please log in to view this report.");
      setLoading(false);
      return;
    }

    getLabReportById(id)
      .then((res) => setReport(res.data || null))
      .catch((err) => setError(err?.response?.data?.message || "You don't have permission to view this report."))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <Skeleton className="h-96 w-full rounded-2xl" />
          ) : error || !report ? (
            <EmptyState
              icon="🔒"
              title="Can't display this report"
              message={error || "This report may not exist or you may not have permission to view it."}
              action={
                <Link href={user ? "/dashboard" : "/login"} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  {user ? "Back to Dashboard" : "Log In"}
                </Link>
              }
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 print:shadow-none">
              <div className="flex items-start justify-between flex-wrap gap-3 border-b border-gray-100 pb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {typeof report.lab === "object" ? report.lab.labName : "Diagnostic Report"}
                  </h1>
                  {typeof report.lab === "object" && (
                    <p className="text-sm text-gray-500 mt-1">
                      {report.lab.address}, {report.lab.city}
                    </p>
                  )}
                </div>
                <Badge label={report.verificationStatus} tone={statusTone(report.verificationStatus)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 py-6 text-sm border-b border-gray-100">
                <div>
                  <p className="text-gray-400">Patient Name</p>
                  <p className="font-medium text-gray-800">{report.patientName}</p>
                </div>
                {typeof report.doctor === "object" && report.doctor && (
                  <div>
                    <p className="text-gray-400">Referring Doctor</p>
                    <p className="font-medium text-gray-800">{report.doctor.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Order ID</p>
                  <p className="font-medium text-gray-800">{report.order.toString().slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Report Date</p>
                  <p className="font-medium text-gray-800">
                    {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="py-6 space-y-6">
                {report.tests.map((test, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 mb-2">{test.testName}</h3>
                    {test.parameters.length === 0 ? (
                      <p className="text-sm text-gray-400">Results pending.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[500px]">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-100">
                              <th className="pb-2 font-medium">Parameter</th>
                              <th className="pb-2 font-medium">Result</th>
                              <th className="pb-2 font-medium">Unit</th>
                              <th className="pb-2 font-medium">Reference Range</th>
                              <th className="pb-2 font-medium">Flag</th>
                            </tr>
                          </thead>
                          <tbody>
                            {test.parameters.map((p, pi) => (
                              <tr key={pi} className="border-b border-gray-50 last:border-0">
                                <td className="py-2 text-gray-700">{p.parameter}</td>
                                <td className="py-2 font-semibold text-gray-900">{p.result}</td>
                                <td className="py-2 text-gray-500">{p.unit}</td>
                                <td className="py-2 text-gray-500">{p.referenceRange}</td>
                                <td className="py-2">
                                  <span
                                    className={
                                      p.flag === "Normal" || !p.flag
                                        ? "text-green-600"
                                        : p.flag === "Critical"
                                        ? "text-red-600 font-semibold"
                                        : "text-yellow-600"
                                    }
                                  >
                                    {p.flag || "Normal"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {report.notes && (
                <div className="border-t border-gray-100 pt-4 text-sm">
                  <p className="text-gray-400">Technician Notes</p>
                  <p className="text-gray-700 mt-1">{report.notes}</p>
                </div>
              )}

              {report.reportFileUrl && (
                <div className="mt-4">
                  <a
                    href={report.reportFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Download Report File
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
