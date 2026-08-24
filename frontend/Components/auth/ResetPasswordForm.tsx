"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import { resetPassword } from "@/services/authServices";
import { useToast } from "@/Components/shared/ToastProvider";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      showToast("Missing email. Please restart the password reset process.", "error");
      router.push("/forgot-password");
      return;
    }
    if (!otp || !newPassword || !confirmPassword) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ email, otp, newPassword });
      showToast(res.message || "Password reset successfully.", "success");
      router.push("/login");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset password.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {email && (
        <p className="text-center text-sm text-gray-500 -mt-2 mb-5">
          Resetting password for <span className="font-semibold text-blue-600">{email}</span>
        </p>
      )}

      <InputField
        label="OTP"
        type="text"
        placeholder="Enter the 6-digit OTP sent to your email"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <PasswordField
        label="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </>
  );
}
