import AuthLayout from "@/Components/auth/AuthLayout";
import ForgotPasswordForm from "@/Components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered email to receive an OTP."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}