"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // Backend integration aage krenege 
    router.push("/dashboard");
  };

  return (
    <>
      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Login
      </button>

      <GoogleButton />

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{" "}
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