"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useAuth } from "@/Components/shared/AuthProvider";

const TRUST_POINTS = [
  { icon: "🩺", label: "Verified doctors only" },
  { icon: "🔒", label: "Bank-level record security" },
  { icon: "⚡", label: "Book in under 2 minutes" },
];

const STEPS = [
  {
    number: "01",
    title: "Search & compare",
    description: "Filter doctors by specialty, location, fee and rating until you find the right fit.",
  },
  {
    number: "02",
    title: "Book & consult",
    description: "Pick an open slot and meet your doctor online or in person — no phone tag required.",
  },
  {
    number: "03",
    title: "Test & track",
    description: "Get lab tests ordered straight from your consultation, with results delivered digitally.",
  },
];

const PILLARS = [
  {
    icon: "🔍",
    title: "For Patients",
    description: "Discover verified doctors, book appointments, and keep every prescription and report in one place.",
    href: "/doctors",
    cta: "Browse doctors",
    accent: "bg-blue-50 text-blue-700",
  },
  {
    icon: "🩺",
    title: "For Physicians",
    description: "Run your practice from one dashboard: appointments, patient history, prescriptions and availability.",
    href: "/physician",
    cta: "Physician login",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: "🧪",
    title: "For Labs",
    description: "Manage your test catalog, track samples, and publish results your patients can actually read.",
    href: "/lab",
    cta: "Lab login",
    accent: "bg-orange-50 text-orange-700",
  },
];

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        {/* ---------- Hero ---------- */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <span aria-hidden>✦</span> Reliefio Health Tech
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-bold text-slate-900 leading-[1.08] tracking-tight">
              From first symptom
              <br />
              to final result.
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
              Reliefio connects you to verified doctors, real consultations, and lab
              results — in one place, without the usual paperwork shuffle.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              {loading ? (
                <>
                  <div className="w-40 h-[52px] bg-slate-200/70 rounded-xl animate-pulse" />
                  <div className="w-40 h-[52px] bg-slate-100 rounded-xl animate-pulse" />
                </>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-sm shadow-blue-600/20"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/doctors"
                    className="border border-slate-300 text-slate-700 hover:bg-white px-7 py-3.5 rounded-xl font-semibold transition"
                  >
                    Find a Doctor
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/doctors"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-sm shadow-blue-600/20"
                  >
                    Find a Doctor
                  </Link>
                  <Link
                    href="/signup"
                    className="border border-slate-300 text-slate-700 hover:bg-white px-7 py-3.5 rounded-xl font-semibold transition"
                  >
                    Create Free Account
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-10">
              {TRUST_POINTS.map((point) => (
                <div key={point.label} className="flex items-center gap-2 text-sm text-slate-600">
                  <span aria-hidden>{point.icon}</span>
                  <span>{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product-preview hero visual */}
          <div className="relative mx-auto w-full max-w-md animate-rise" style={{ animationDelay: "120ms" }}>
            {/* Back card for depth */}
            <div
              className="absolute -top-4 -right-4 w-full h-full bg-white/70 rounded-3xl border border-white shadow-lg rotate-3"
              aria-hidden
            />

            <Link
              href="/doctors"
              className="group relative block bg-white rounded-3xl shadow-xl p-7 -rotate-2 hover:rotate-0 transition-transform duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                  <Image src="/doctor.png" alt="" width={44} height={44} className="object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">Dr. Ananya Iyer</p>
                  <p className="text-sm text-blue-600 font-medium">Dermatologist &middot; Bangalore</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm">
                <span className="font-semibold text-slate-800">⭐ 4.8</span>
                <span className="text-slate-400">(120 reviews)</span>
              </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Consultation fee</p>
                  <p className="font-bold text-slate-900">₹700</p>
                </div>
                <span className="bg-blue-600 group-hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
                  Book Appointment
                </span>
              </div>

              {/* Floating chips */}
              <div className="absolute -top-4 -right-3 bg-white rounded-xl shadow-lg px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                <span aria-hidden>✅</span> Appointment Confirmed
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold text-orange-600 border border-orange-100">
                <span aria-hidden>🧪</span> Lab Report Ready
              </div>
            </Link>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">How Reliefio works</h2>
            <p className="mt-3 text-slate-600">Three steps between &quot;something&apos;s wrong&quot; and &quot;here&apos;s what to do about it.&quot;</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="text-sm font-mono-num font-semibold text-blue-600">{step.number}</span>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Pillars / modules ---------- */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Built for everyone in the care loop
            </h2>
            <p className="mt-3 text-slate-600">One platform, three sides of the same visit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-7"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${pillar.accent}`}>
                  <span aria-hidden>{pillar.icon}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed text-[15px]">{pillar.description}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {pillar.cta}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- Closing CTA band ---------- */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl px-8 py-14 md:py-16 text-center shadow-xl shadow-blue-600/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to take the first step?
            </h2>
            <p className="mt-3 text-blue-100 max-w-lg mx-auto">
              Find a doctor today, or set up your professional account if you&apos;re a
              physician or diagnostic lab.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/doctors"
                className="bg-white text-blue-700 hover:bg-blue-50 px-7 py-3.5 rounded-xl font-semibold transition"
              >
                Find a Doctor
              </Link>
              <Link
                href="/signup"
                className="border border-white/40 text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold transition"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
