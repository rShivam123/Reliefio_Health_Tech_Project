"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Components/shared/AuthProvider";
import { useToast } from "@/Components/shared/ToastProvider";
import NotificationBell from "@/Components/shared/NotificationBell";

const ROLE_PORTAL: Record<string, { label: string; href: string }> = {
  Doctor: { label: "Physician Portal", href: "/physician" },
  Lab: { label: "Lab Portal", href: "/lab" },
};

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully.", "success");
    setProfileOpen(false);
    router.push("/");
  };

  const portal = user ? ROLE_PORTAL[user.role] : undefined;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center p-1.5 shrink-0">
            <Image src="/logo.jpeg" alt="Reliefio Health Tech" width={36} height={36} className="rounded-md object-contain" priority />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Reliefio Health Tech</h1>
            <p className="text-xs text-gray-500">Healthcare Management System</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/doctors" className="text-gray-700 font-medium hover:text-blue-600 transition">
            Find Doctors
          </Link>
          {user?.role === "Patient" && (
            <>
              <Link href="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link href="/my-appointments" className="text-gray-700 font-medium hover:text-blue-600 transition">
                My Appointments
              </Link>
              <Link href="/my-lab-orders" className="text-gray-700 font-medium hover:text-blue-600 transition">
                My Lab Orders
              </Link>
            </>
          )}
          {portal && (
            <Link href={portal.href} className="text-gray-700 font-medium hover:text-blue-600 transition">
              {portal.label}
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <NotificationBell />
              <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user.firstName?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                <span className="text-gray-400 text-xs">▾</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {portal && (
                    <Link
                      href={portal.href}
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {portal.label}
                    </Link>
                  )}
                  {user.role === "Patient" && (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/my-appointments"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Appointments
                      </Link>
                      <Link
                        href="/my-lab-orders"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Lab Orders
                      </Link>
                    </>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
                Login
              </Link>
              <Link href="/signup" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-4 space-y-3 bg-white">
          <Link href="/doctors" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
            Find Doctors
          </Link>
          {portal && (
            <Link href={portal.href} onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
              {portal.label}
            </Link>
          )}
          {user ? (
            <>
              {user.role === "Patient" && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
                    Dashboard
                  </Link>
                  <Link href="/my-appointments" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
                    My Appointments
                  </Link>
                  <Link href="/my-lab-orders" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
                    My Lab Orders
                  </Link>
                </>
              )}
              <Link href="/settings" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-1">
                Account Settings
              </Link>
              <button onClick={handleLogout} className="block w-full text-left text-red-600 font-medium py-1">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-lg border border-blue-600 text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
