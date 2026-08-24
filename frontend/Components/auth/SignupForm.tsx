"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import GoogleButton from "./GoogleButton";

import { signupUser } from "@/services/authServices";
import { useToast } from "@/Components/shared/ToastProvider";

export default function SignupForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const names = formData.fullName.trim().split(" ");

    const firstName = names[0];
    const lastName = names.slice(1).join(" ");

    try {
      setLoading(true);

      const res = await signupUser({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "Patient",
      });

      showToast(res.message || "Account created. Please verify your email.", "success");

      router.push(`/verify-otp?email=${formData.email}`);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Signup Failed";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InputField
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={(e) =>
          setFormData({
            ...formData,
            fullName: e.target.value,
          })
        }
      />

      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) =>
          setFormData({
            ...formData,
            email: e.target.value,
          })
        }
      />

      <InputField
        label="Mobile Number"
        type="tel"
        placeholder="Enter your mobile number"
        value={formData.phone}
        onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value,
          })
        }
      />

      <PasswordField
        label="Password"
        placeholder="Create password"
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({
            ...formData,
            confirmPassword: e.target.value,
          })
        }
      />

      <div className="flex items-start gap-2 mb-6">
        <input type="checkbox" className="mt-1" />

        <p className="text-sm text-gray-600">
          I agree to the{" "}
          <span className="text-blue-600 cursor-pointer font-medium">
            Terms & Conditions
          </span>
        </p>
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <div className="mt-5">
        <GoogleButton />
      </div>

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