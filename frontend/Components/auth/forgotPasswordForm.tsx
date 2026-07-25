"use client";

import { useRouter } from "next/navigation";
import InputField from "./InputField";

export default function ForgotPasswordForm() {
  const router = useRouter();

  return (
    <>
      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your registered email"
      />

      <button
        onClick={() => router.push("/verify-otp")}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Send OTP
      </button>
    </>
  );
}