import Footer from "@/Components//Footer";
import Navbar from "@/Components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

     <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
  <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

    {/* Left Section */}
    <div>

      <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
        Trusted  Reliefio Healthcare Platform
      </span>

      <h1 className="mt-6 text-5xl font-bold text-gray-900 leading-tight">
        Modern Healthcare
        <br />
        Made Simple & Secure
      </h1>

      <p className="mt-6 text-lg text-gray-600 leading-8">
        Reliefio Health Tech helps patients and healthcare professionals manage
        appointments, medical records, and health information securely
        from one smart digital platform.
      </p>

      <div className="flex gap-5 mt-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition">
          Get Started
        </button>

        <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-7 py-3 rounded-xl font-semibold transition">
          Create Account
        </button>
      </div>

    </div>

    {/* Right Section */}
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Why Choose Reliefio Health?
      </h2>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✔</span>
          <p>Secure Medical Records</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✔</span>
          <p>Easy Appointment Booking</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✔</span>
          <p>Trusted Healthcare Professionals</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✔</span>
          <p>24×7 Digital Healthcare Access</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-green-600 text-xl">✔</span>
          <p>Fast & Secure Patient Dashboard</p>
        </div>

      </div>

    </div>

  </section>
</main>

      <Footer />
    </>
  );
}