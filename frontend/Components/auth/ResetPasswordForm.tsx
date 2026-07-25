"use client";

import { useRouter } from "next/navigation";
import PasswordField from "./PasswordField";

export default function ResetPasswordForm() {
  const router = useRouter();

  return (
    <>
      <PasswordField
        label="New Password"
        placeholder="Enter new password"
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm new password"
      />

      <button
        onClick={() => router.push("/login")}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Update Password
      </button>
    </>
  );
}