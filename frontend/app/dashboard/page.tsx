import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import DashboardHeader from "@/Components/dashboard/DashboardHeader";
import RoleCard from "@/Components/dashboard/RoleCard";
import SupportSection from "@/Components/dashboard/SupportSection";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <DashboardHeader />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <RoleCard
              title="Find a Doctor"
              description="Search trusted doctors by specialty or location, view profiles and book an appointment."
              image="/doctor.png"
              href="/doctors"
              color="bg-blue-600"
            />

            <RoleCard
              title="Physician Portal"
              description="Manage your appointments, patients, consultations, prescriptions and availability."
              image="/pst.jpg"
              href="/physician"
              color="bg-emerald-600"
              badge="For Doctors"
            />

            <RoleCard
              title="Lab / Diagnostic Partner"
              description="Manage lab tests, orders, sample collection, results and reports."
              image="/labd.jpg"
              href="/lab"
              color="bg-orange-500"
              badge="For Lab Partners"
            />
          </div>

          <SupportSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
