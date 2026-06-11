import { STATUS_COLORS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const DARK_COLORS = {
  Saved: "dark:bg-dark-s2 dark:text-dark-tx2",
  Applied: "dark:bg-dark-blue-tint dark:text-dark-accent3",
  Assessment: "dark:bg-dark-purple-tint dark:text-purple-400",
  Interview: "dark:bg-dark-teal-tint dark:text-teal-400",
  Offer: "dark:bg-dark-green-tint2 dark:text-emerald-400",
  Rejected: "dark:bg-dark-red-tint dark:text-red-400",
};

export default function StatusBadge({ status, size = "md" }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Saved"];
  const d = DARK_COLORS[status] || DARK_COLORS["Saved"];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        c.bg,
        c.text,
        d,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: c.dot }}
      />
      {status}
    </span>
  );
}
