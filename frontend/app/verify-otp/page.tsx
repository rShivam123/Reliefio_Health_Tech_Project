"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useToast } from "@/Components/shared/ToastProvider";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;

      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      showToast("Please enter 6 digit OTP", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp: finalOTP,
      });

      showToast(res.data.message || "Account verified successfully.", "success");

      router.push("/login");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "OTP Verification Failed";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-center font-semibold text-blue-600">
          {email}
        </p>

        <div className="flex justify-between mt-8 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              value={digit}
              maxLength={1}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              className="w-12 h-12 border rounded-xl text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center mt-5 text-sm text-gray-500">
          Didn&apos;t receive OTP?

          <span className="text-blue-600 cursor-pointer font-medium">
            {" "}Resend
          </span>
        </p>

      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOTPForm />
    </Suspense>
  );
}