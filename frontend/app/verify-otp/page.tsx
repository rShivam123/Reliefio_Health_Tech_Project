"use client";

import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-4">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Enter the 6-digit OTP sent to your email.
        </p>

        <div className="flex justify-between mt-8 gap-2">

          {[1,2,3,4,5,6].map((item)=>(
            <input
              key={item}
              maxLength={1}
              className="w-12 h-12 border rounded-xl text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Verify OTP
        </button>

        <p className="text-center mt-5 text-sm text-gray-500">
          Didn't receive OTP?

          <span className="text-blue-600 cursor-pointer font-medium">
            {" "}Resend
          </span>
        </p>

      </div>

    </div>
  );
}