"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface RoleGuardProps {
  allow: string[];
  children: ReactNode;
}

/**
 * Client-side route guard. This is a UX convenience only - the backend
 * enforces the real authorization on every request via `protect` +
 * `requireRole`, so a user can never bypass access by skipping this.
 */
export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace("/unauthorized");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || !user || !allow.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
