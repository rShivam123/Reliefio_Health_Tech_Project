"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import GoogleButton from "./GoogleButton";

import { loginUser } from "@/services/authServices";
import { useAuth } from "@/Components/shared/AuthProvider";
import { useToast } from "@/Components/shared/ToastProvider";

const roleHome: Record<string, string> = {
  Doctor: "/physician",
  Lab: "/lab",
};

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      showToast(res.message || "Login successful", "success");

      // Load the authenticated user into context before redirecting so
      // role-protected pages don't briefly bounce back to /login.
      await refresh();

      const role = res.data?.user?.role as string | undefined;
      router.push(role && roleHome[role] ? roleHome[role] : "/dashboard");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed. Please try again.";
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
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <div className="flex justify-between items-center mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Remember Me
        </label>

        <Link
          href="/forgot-password"
          className="text-blue-600 text-sm hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <GoogleButton />

      <p className="text-center mt-6 text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-blue-600 font-semibold hover:underline"
        >
          Create Account
        </Link>
      </p>
    </>
  );
}
