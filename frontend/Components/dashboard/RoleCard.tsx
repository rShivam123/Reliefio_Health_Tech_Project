import Image from "next/image";
import Link from "next/link";

interface RoleCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  color: string;
  badge?: string;
}

export default function RoleCard({
  title,
  description,
  image,
  href,
  color,
  badge,
}: RoleCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-7 overflow-hidden">
        {/* Color accent bar - ties each card to its portal's real accent color */}
        <span className={`absolute top-0 left-0 right-0 h-1.5 ${color}`} aria-hidden />

        {badge && (
          <span className="absolute top-6 right-6 text-[11px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}

        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
          <Image src={image} alt="" width={40} height={40} className="object-contain" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900 tracking-tight">{title}</h2>

        <p className="mt-2.5 text-slate-600 leading-relaxed text-[15px]">{description}</p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span>Continue</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
