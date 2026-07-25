import Image from "next/image";

export default function DashboardHeader() {
  return (
    <div className="text-center mb-12">
      <Image
        src="/logo.jpeg"
        alt="Reilio Health"
        width={130}
        height={130}
        className="mx-auto"
        priority
      />

      <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
        Select Your Profession
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
        Choose your role to continue. We'll personalize your healthcare
        experience based on your profession.
      </p>
    </div>
  );
}