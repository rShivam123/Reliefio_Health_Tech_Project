import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Reliefio Health Tech"
            width={48}
            height={48}
            priority
          />

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Reliefio Health Tech 
            </h1>

            <p className="text-xs text-gray-500">
              Healthcare Management System
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  );
}