import { useMemo } from "react";
import useAppStore from "@/store/appStore";

const STAGES = [
  { key: "Applied", color: "#2f54c8" },
  { key: "Assessment", color: "#14b8a6" },
  { key: "Interview", color: "#3b82f6" },
  { key: "Offer", color: "#22c55e" },
];

export default function ApplicationFunnel() {
  const applications = useAppStore((s) => s.applications);

  const funnel = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      counts[app.status] = (counts[app.status] || 0) + 1;
    }

    // Each stage includes everything at or beyond that stage
    const applied =
      (counts.Applied || 0) +
      (counts.Assessment || 0) +
      (counts.Interview || 0) +
      (counts.Offer || 0);
    const assessment =
      (counts.Assessment || 0) + (counts.Interview || 0) + (counts.Offer || 0);
    const interview = (counts.Interview || 0) + (counts.Offer || 0);
    const offer = counts.Offer || 0;

    const stageCounts = [applied, assessment, interview, offer];
    const max = Math.max(...stageCounts, 1);

    return STAGES.map((s, i) => ({
      ...s,
      count: stageCounts[i],
      width: `${Math.round((stageCounts[i] / max) * 100)}%`,
      dropPct:
        i < STAGES.length - 1 && stageCounts[i] > 0
          ? `${Math.round((1 - stageCounts[i + 1] / stageCounts[i]) * 100)}% drop-off`
          : null,
    }));
  }, [applications]);

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-5">
        Application Funnel
      </h3>
      {applications.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          No applications yet
        </p>
      ) : (
        <div className="space-y-3">
          {funnel.map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-dark-tx1 mb-1.5">
                <span>{f.key}</span>
                <span>{f.count}</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 dark:bg-dark-s2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: f.color,
                    width: f.count > 0 ? f.width : "0%",
                  }}
                />
              </div>
              {f.dropPct && (
                <p className="text-xs text-gray-400 text-center py-1.5">
                  ↓ {f.dropPct}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}