import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-3 text-gray-600">You don&apos;t have permission to access this page.</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Go to Dashboard
          </Link>
          <Link href="/" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
