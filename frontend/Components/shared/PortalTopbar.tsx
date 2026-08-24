"use client";

import Link from "next/link";
import NotificationBell from "./NotificationBell";

interface PortalTopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function PortalTopbar({ title, onMenuClick }: PortalTopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 text-2xl" aria-label="Open menu">
          ☰
        </button>
        <h1 className="font-bold text-gray-900 text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition ml-2">
          &larr; Back to site
        </Link>
      </div>
    </header>
  );
}
