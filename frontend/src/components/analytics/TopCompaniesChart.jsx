import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useAppStore from "@/store/appStore";

export default function TopCompaniesChart() {
  const applications = useAppStore((s) => s.applications);

  const topCompanies = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      counts[app.company] = (counts[app.company] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [applications]);

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-5">
        Top Companies Applied To
      </h3>
      {topCompanies.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No applications yet
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={topCompanies}
            layout="vertical"
            margin={{ left: 10, right: 20, top: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="value" fill="#2f54c8" radius={[0, 4, 4, 0]}>
              {topCompanies.map((_, i) => (
                <Cell key={i} fill="#2f54c8" opacity={1 - i * 0.12} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
