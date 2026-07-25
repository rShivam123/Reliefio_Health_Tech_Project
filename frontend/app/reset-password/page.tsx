import AuthLayout from "@/Components/auth/AuthLayout";
import ResetPasswordForm from "@/Components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a strong password for your account."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}