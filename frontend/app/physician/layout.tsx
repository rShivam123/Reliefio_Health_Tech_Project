"use client";

import { useState } from "react";
import RoleGuard from "@/Components/shared/RoleGuard";
import PhysicianSidebar from "@/Components/physician/PhysicianSidebar";
import PortalTopbar from "@/Components/shared/PortalTopbar";

export default function PhysicianLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allow={["Doctor"]}>
      <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <PhysicianSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <PortalTopbar title="Physician Portal" onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
