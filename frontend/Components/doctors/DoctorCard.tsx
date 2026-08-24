import Link from "next/link";
import Image from "next/image";
import { Doctor } from "@/types/doctor";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col h-full">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 overflow-hidden shrink-0 flex items-center justify-center">
          <Image
            src={doctor.profileImage || "/doctor.png"}
            alt={doctor.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
            {doctor.verificationStatus === "Verified" && (
              <span title="Verified doctor" className="text-blue-600 text-sm shrink-0">
                ✔️
              </span>
            )}
          </div>
          <p className="text-sm text-blue-600 font-medium truncate">{doctor.specialty}</p>
          <p className="text-sm text-gray-500">{doctor.experience} yrs experience</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <span className="flex items-center gap-1 font-medium text-gray-800">
          ⭐ {doctor.rating > 0 ? doctor.rating.toFixed(1) : "New"}
        </span>
        <span className="text-gray-400">({doctor.reviewCount} reviews)</span>
      </div>

      <p className="text-sm text-gray-500 mt-1 truncate">
        {doctor.hospital || doctor.clinic || "Independent practice"} &middot; {doctor.location}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {doctor.consultationModes.map((mode) => (
          <span key={mode} className="text-xs bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full font-medium">
            {mode}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Consultation fee</p>
          <p className="font-bold text-gray-900">₹{doctor.consultationFee}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/doctors/${doctor._id}`}
            className="px-3.5 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition whitespace-nowrap"
          >
            View Profile
          </Link>
          <Link
            href={`/doctors/${doctor._id}?book=1`}
            className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
