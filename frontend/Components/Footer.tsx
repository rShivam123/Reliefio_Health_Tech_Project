import Image from "next/image";
import Link from "next/link";

const LINK_COLUMNS = [
  {
    heading: "Patients",
    links: [
      { label: "Find Doctors", href: "/doctors" },
      { label: "My Appointments", href: "/my-appointments" },
      { label: "My Lab Orders", href: "/my-lab-orders" },
    ],
  },
  {
    heading: "For Professionals",
    links: [
      { label: "Physician Portal", href: "/physician" },
      { label: "Lab Portal", href: "/lab" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "mailto:support@reliefio.health" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-100 flex items-center justify-center p-1.5 shrink-0">
              <Image src="/logo.jpeg" alt="Reliefio Health Tech" width={32} height={32} className="rounded-md object-contain" />
            </div>
            <span className="font-bold text-slate-900">Reliefio Health Tech</span>
          </Link>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
            Verified doctors, real consultations, and lab results — one platform
            for every step of care.
          </p>
        </div>

        {LINK_COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="text-sm font-semibold text-slate-900">{column.heading}</p>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">© {year} Reliefio Health Tech. All rights reserved.</p>
          <p className="text-xs text-slate-400">Made for better, simpler healthcare.</p>
        </div>
      </div>
    </footer>
  );
}
