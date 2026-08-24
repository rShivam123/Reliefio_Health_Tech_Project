interface BadgeProps {
  label: string;
  tone?: "green" | "yellow" | "red" | "blue" | "gray" | "orange" | "purple";
}

const TONE_CLASSES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
};

const STATUS_TONE_MAP: Record<string, BadgeProps["tone"]> = {
  Pending: "yellow",
  Confirmed: "blue",
  Completed: "green",
  Cancelled: "red",
  Draft: "gray",
  Processing: "blue",
  "Sample Collection": "yellow",
  "Sample Received": "blue",
  Collected: "blue",
  Received: "purple",
  Rejected: "red",
  "Pending Verification": "orange",
  Verified: "blue",
  Published: "green",
  Paid: "green",
  Verified_Doctor: "green",
};

export function statusTone(status: string): NonNullable<BadgeProps["tone"]> {
  return STATUS_TONE_MAP[status] || "gray";
}

export default function Badge({ label, tone = "gray" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${TONE_CLASSES[tone]}`}>
      {label}
    </span>
  );
}
