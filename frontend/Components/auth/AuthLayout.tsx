import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-blue-600 text-white p-12">

          <h1 className="text-4xl font-bold leading-tight">
            Welcome to
            <br />
            Reliefio Health
          </h1>

          <p className="mt-6 text-blue-100 leading-8">
            A secure healthcare platform that helps patients and healthcare
            professionals manage appointments, medical records and health
            information in one place.
          </p>

          <div className="mt-10 space-y-4">

            <div>✔ Secure Patient Records</div>

            <div>✔ Easy Appointment Booking</div>

            <div>✔ Trusted Healthcare Platform</div>

            <div>✔ 24×7 Digital Access</div>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-10">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              {subtitle}
            </p>

            {children}

          </div>

        </div>

      </div>
    </div>
  );
}