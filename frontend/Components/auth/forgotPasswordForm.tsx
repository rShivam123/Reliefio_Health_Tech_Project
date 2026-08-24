"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import { forgotPassword } from "@/services/authServices";
import { useToast } from "@/Components/shared/ToastProvider";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      showToast("Please enter your registered email.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      showToast(res.message || "OTP sent to your email.", "success");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSendOTP}
        disabled={loading}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </>
  );
}
