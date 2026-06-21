import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useAppStore from "@/store/appStore";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ActivityChartCard() {
  const applications = useAppStore((s) => s.applications);

  const chartData = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        month: MONTHS[d.getMonth()],
        year: d.getFullYear(),
        apps: 0,
      });
    }
    for (const app of applications) {
      const date = app.dateApplied
        ? new Date(app.dateApplied)
        : new Date(app.createdAt);
      if (!date || isNaN(date)) continue;
      const bucket = data.find(
        (b) =>
          b.month === MONTHS[date.getMonth()] && b.year === date.getFullYear(),
      );
      if (bucket) bucket.apps++;
    }
    return data;
  }, [applications]);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-dark-s1 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-dark-tx1 text-sm sm:text-base">
            Application Activity
          </h3>
          <p className="text-xs text-gray-400 dark:text-dark-tx3">
            Applications submitted over time
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-tx2">
          <span className="w-2 h-2 rounded-full bg-dark-accent" /> Applications
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,42,58,0.6)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#4e5470" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#4e5470" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #252a3a",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              backgroundColor: "#1a1e2a",
              color: "#e8eaf2",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="apps"
            stroke="#3d66e8"
            strokeWidth={2.5}
            fill="#3d66e8"
            fillOpacity={0.15}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}