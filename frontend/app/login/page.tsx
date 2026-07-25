import AuthLayout from "@/Components/auth/AuthLayout";
import LoginForm from "@/Components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome to Reliefio Health "
      subtitle="Sign in to access your Reliefio Health dashboard."
    >
      <LoginForm />
    </AuthLayout>
  );
}