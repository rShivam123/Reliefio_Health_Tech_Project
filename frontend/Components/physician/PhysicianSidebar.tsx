"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/Components/shared/AuthProvider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/physician", icon: "🏠" },
  { label: "Appointments", href: "/physician/appointments", icon: "📅" },
  { label: "Patients", href: "/physician/patients", icon: "🧑‍🤝‍🧑" },
  { label: "Availability", href: "/physician/availability", icon: "🕐" },
  { label: "Prescriptions", href: "/physician/prescriptions", icon: "💊" },
  { label: "Profile", href: "/physician/profile", icon: "⚙️" },
  { label: "Settings", href: "/settings", icon: "🔧" },
];

interface PhysicianSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhysicianSidebar({ isOpen, onClose }: PhysicianSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => (href === "/physician" ? pathname === "/physician" : pathname.startsWith(href));

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-gray-100">
        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Physician Portal</p>
        <p className="mt-1 font-bold text-gray-900 truncate">
          {user ? `Dr. ${user.firstName} ${user.lastName}` : "Loading..."}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-72 bg-white h-full">{content}</div>
        </div>
      )}
    </>
  );
}
