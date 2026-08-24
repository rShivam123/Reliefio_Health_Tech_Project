"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import BookingModal from "@/Components/doctors/BookingModal";
import EmptyState from "@/Components/shared/EmptyState";
import { Skeleton } from "@/Components/shared/Skeleton";
import { getDoctorById } from "@/services/doctorServices";
import { Doctor, Review } from "@/types/doctor";

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoctorById(id)
      .then((res) => {
        if (res.data) {
          setDoctor(res.data.doctor);
          setReviews(res.data.reviews || []);
          if (searchParams.get("book") === "1") setShowBooking(true);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-12">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !doctor) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-20">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon="🩺"
              title="Doctor not found"
              message="This doctor profile may have been removed or the link is incorrect."
              action={
                <Link href="/doctors" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  Back to Doctors
                </Link>
              }
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const avgRating = doctor.rating > 0 ? doctor.rating.toFixed(1) : "New";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link href="/doctors" className="text-sm text-blue-600 hover:underline font-medium">
            &larr; Back to Doctors
          </Link>

          {/* Header card */}
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 mt-4 flex flex-col md:flex-row gap-6">
            <div className="w-28 h-28 rounded-2xl bg-blue-50 overflow-hidden shrink-0 mx-auto md:mx-0">
              <Image
                src={doctor.profileImage || "/doctor.png"}
                alt={doctor.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{doctor.name}</h1>
                {doctor.verificationStatus === "Verified" && (
                  <span className="text-blue-600 text-lg" title="Verified doctor">
                    ✔️
                  </span>
                )}
              </div>
              <p className="text-blue-600 font-semibold mt-1">{doctor.specialty}</p>
              <p className="text-gray-500 mt-1">{doctor.qualification}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-600">
                <span className="font-medium text-gray-800">⭐ {avgRating}</span>
                <span>{doctor.reviewCount} reviews</span>
                <span>{doctor.experience} years experience</span>
                <span>{doctor.hospital || doctor.clinic || "Independent Practice"}</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {doctor.consultationModes.map((mode) => (
                  <span key={mode} className="text-xs bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full font-medium">
                    {mode}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-400">Consultation fee</p>
                <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition w-full md:w-auto"
              >
                Book Appointment
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 text-lg">About</h2>
                <p className="text-gray-600 mt-2 leading-7">{doctor.about || "No additional information provided."}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 text-lg">Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 mt-2 text-sm">No reviews yet. Be the first to review this doctor.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {reviews.map((r) => (
                      <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800 text-sm">
                            {r.patient.firstName} {r.patient.lastName}
                          </p>
                          <span className="text-yellow-500 text-sm">{"⭐".repeat(r.rating)}</span>
                        </div>
                        {r.comment && <p className="text-gray-600 text-sm mt-1">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900">Details</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Registration No.</dt>
                    <dd className="text-gray-800 font-medium text-right">{doctor.registrationNumber || "-"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Languages</dt>
                    <dd className="text-gray-800 font-medium text-right">{doctor.languages.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Location</dt>
                    <dd className="text-gray-800 font-medium text-right">{doctor.location || "-"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Hospital/Clinic</dt>
                    <dd className="text-gray-800 font-medium text-right">{doctor.hospital || doctor.clinic || "-"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showBooking && <BookingModal doctor={doctor} onClose={() => setShowBooking(false)} />}
    </>
  );
}
