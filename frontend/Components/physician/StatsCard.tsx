interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  tone?: "blue" | "green" | "yellow" | "purple" | "orange";
}

const TONE_CLASSES: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function StatsCard({ label, value, icon = "📊", tone = "blue" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${TONE_CLASSES[tone]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
