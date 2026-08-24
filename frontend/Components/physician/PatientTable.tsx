import Link from "next/link";
import { PhysicianPatient } from "@/services/physicianServices";

export default function PatientTable({ patients }: { patients: PhysicianPatient[] }) {
  return (
    <div className="space-y-3">
      {patients.map((p) => (
        <Link
          key={p._id}
          href={`/physician/patients/${p._id}`}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
              {p.firstName?.[0]?.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {p.firstName} {p.lastName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {p.phone} {p.gender ? `\u00b7 ${p.gender}` : ""}
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-gray-500 shrink-0">
            <div>
              <p className="text-xs text-gray-400">Last Visit</p>
              <p className="font-medium text-gray-700">{p.lastVisit || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Next Appointment</p>
              <p className="font-medium text-gray-700">{p.nextAppointment || "-"}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
