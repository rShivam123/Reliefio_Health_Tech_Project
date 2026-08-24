"use client";

import Image from "next/image";
import { useAuth } from "@/Components/shared/AuthProvider";

export default function DashboardHeader() {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="text-center mb-14 animate-rise">
      <div className="mx-auto w-24 h-24 rounded-3xl bg-white shadow-md ring-1 ring-slate-100 flex items-center justify-center p-3">
        <Image
          src="/logo.jpeg"
          alt="Reliefio Health Tech"
          width={100}
          height={100}
          className="rounded-xl object-contain"
          priority
        />
      </div>

      <p className="mt-6 text-sm font-semibold text-blue-600 tracking-wide uppercase">
        {timeGreeting}
        {user ? `, ${user.firstName}` : ""}
      </p>

      <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
        Where would you like to go?
      </h1>

      <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
        Book a doctor as a patient, or jump into your professional dashboard
        if you&apos;re a physician or lab partner.
      </p>
    </div>
  );
}
