import { useMemo } from "react";
import { TrendingUp, Star, CornerUpLeft } from "lucide-react";
import useAppStore from "@/store/appStore";

function Sparkline({ color }) {
  const points = "0,30 20,25 40,28 60,20 80,22 100,15 120,18";
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10 mt-3">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function AnalyticsStatCards() {
  const applications = useAppStore((s) => s.applications);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((a) =>
      ["Interview", "Offer"].includes(a.status),
    ).length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const responses = applications.filter(
      (a) => a.status !== "Saved" && a.status !== "Applied",
    ).length;

    const pct = (n) =>
      total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "0%";

    return [
      {
        label: "Interview Rate",
        value: pct(interviews),
        icon: TrendingUp,
        iconBg: "bg-green-50",
        iconColor: "text-green-500",
        lineColor: "#22c55e",
      },
      {
        label: "Offer Rate",
        value: pct(offers),
        icon: Star,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-500",
        lineColor: "#f59e0b",
      },
      {
        label: "Response Rate",
        value: pct(responses),
        icon: CornerUpLeft,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
        lineColor: "#3b82f6",
      },
    ];
  }, [applications]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-dark-tx2">
              {s.label}
            </span>
            <div
              className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}
            >
              <s.icon size={15} className={s.iconColor} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
              {s.value}
            </span>
          </div>
          <Sparkline color={s.lineColor} />
        </div>
      ))}
    </div>
  );
}
