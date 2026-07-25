"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import GoogleButton from "./GoogleButton";

export default function SignupForm() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/verify-otp");
  };

  return (
    <>
      <InputField
        label="Full Name"
        placeholder="Enter your full name"
      />

      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <InputField
        label="Mobile Number"
        type="tel"
        placeholder="Enter your mobile number"
      />

      <PasswordField
        label="Password"
        placeholder="Create password"
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm password"
      />

      <div className="flex items-start gap-2 mb-6">
        <input
          type="checkbox"
          className="mt-1"
        />

        <p className="text-sm text-gray-600">
          I agree to the
          <span className="text-blue-600 cursor-pointer">
            {" "}Terms & Conditions
          </span>
        </p>
      </div>

      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Create Account
      </button>

      <GoogleButton />

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}