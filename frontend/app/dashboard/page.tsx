import DashboardHeader from "@/Components/dashboard/DashboardHeader";
import RoleCard from "@/Components/dashboard/RoleCard";
import SupportSection from "@/Components/dashboard/SupportSection";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          <RoleCard
            title="Doctor"
            description="Consult with patients, manage appointments and deliver quality healthcare services."
            image="/doctor.png"
            href="/dashboard/doctor"
            color="bg-blue-600"
          />

          <RoleCard
            title="Physiotherapist"
            description="Manage rehabilitation sessions, patient recovery and therapy plans."
            image="/pst.jpg"
            href="/dashboard/physiotherapist"
            color="bg-green-600"
          />

          <RoleCard
            title="Lab / Diagnostic Partner"
            description="Manage lab tests, reports, sample collection and diagnostic services."
            image="/labd.jpg"
            href="/dashboard/lab"
            color="bg-orange-500"
          />

        </div>

        <SupportSection />

      </div>

    </main>
  );
}