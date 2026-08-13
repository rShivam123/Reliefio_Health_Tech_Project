// "use client";
// import {useState} from "react";
// import { useRouter } from "next/navigation";
// import InputField from "./InputField";

// export default function ForgotPasswordForm() {
//   const router = useRouter();

//   return (
//     <>
//       <InputField
//         label ="Email Address"
//         type="email"
//         placeholder="Enter your registered email"
//       />

//       <button
//         onClick={() => router.push("/verify-otp")}
//         className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
//       >
//         Send OTP
//       </button>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import { forgotPassword } from "@/services/authServices";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const handleSendOTP = async () => {
    try {
      const res = await forgotPassword(email);

      alert(res.message);

      router.push(`/verify-otp?email=${email}`);
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSendOTP}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
      >
        Send OTP
      </button>
    </>
  );
}