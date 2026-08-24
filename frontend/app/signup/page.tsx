import AuthLayout from "@/Components/auth/AuthLayout";
import SignupForm from "@/Components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Reliefio Health and manage your healthcare digitally."
    >
      <SignupForm />
    </AuthLayout>
  );
}



