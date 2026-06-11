import { useMemo } from "react";
import {
  BarChart,
  Bar,
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
const RESPONSE_STATUSES = ["Assessment", "Interview", "Offer", "Rejected"];

export default function MonthlyTrendsChart() {
  const applications = useAppStore((s) => s.applications);

  const chartData = useMemo(() => {
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        month: MONTHS[d.getMonth()],
        year: d.getFullYear(),
        sent: 0,
        responses: 0,
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
      if (!bucket) continue;
      bucket.sent++;
      if (RESPONSE_STATUSES.includes(app.status)) bucket.responses++;
    }

    return data;
  }, [applications]);

  return (
    <div className="col-span-3 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1">
          Monthly Application Trends
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-dark-accent" />{" "}
            Applications Sent
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> Responses
            Received
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ left: -20, right: 0, top: 5, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey="sent" fill="#2f54c8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="responses" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
