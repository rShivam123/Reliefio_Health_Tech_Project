import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-3 text-gray-600">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-8">
          <Link href="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
