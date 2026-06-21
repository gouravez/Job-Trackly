import { useEffect, useState } from "react";
import { applicationService } from "@/services/api";
import { formatDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Real activity feed, backed by the `timeline_events` table. A row is
// recorded automatically by the backend whenever an application is created
// or its status changes (see application.service.js: addTimelineEvent).
// ---------------------------------------------------------------------------
const STATUS_DOT = {
  Saved: "bg-gray-400",
  Applied: "bg-blue-500",
  Assessment: "bg-purple-500",
  Interview: "bg-teal-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

export default function ActivityHistory({ applicationId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await applicationService.getTimeline(applicationId);
        if (!cancelled) setEvents(data.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Failed to load activity history",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    if (applicationId) load();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-4">
        Activity History
      </h3>

      {isLoading && (
        <p className="text-sm text-gray-400 dark:text-dark-tx3">Loading...</p>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!isLoading && !error && events.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-dark-tx3">
          No activity recorded yet.
        </p>
      )}

      {!isLoading && !error && events.length > 0 && (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-3">
              <span
                className={`w-2 h-2 rounded-full ${STATUS_DOT[e.status] || "bg-gray-400"} mt-1.5 flex-shrink-0`}
              />
              <div>
                <p className="text-sm text-gray-700 dark:text-dark-tx2">
                  {e.note || `Status changed to ${e.status}`}
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-tx3">
                  {formatDate(e.eventDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}