"use client";

import { useState } from "react";
import RoleGuard from "@/Components/shared/RoleGuard";
import LabSidebar from "@/Components/lab/LabSidebar";
import PortalTopbar from "@/Components/shared/PortalTopbar";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allow={["Lab"]}>
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <LabSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-w-0">
          <PortalTopbar title="Lab Portal" onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
