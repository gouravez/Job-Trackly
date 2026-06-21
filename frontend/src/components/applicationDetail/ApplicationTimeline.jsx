import { useEffect, useState } from "react";
import { Bookmark, Send, ClipboardList, Users, Award } from "lucide-react";
import { applicationService } from "@/services/api";
import { cn, formatDate } from "@/lib/utils";

const TIMELINE = [
  {
    key: "Saved",
    icon: Bookmark,
    color: "bg-gray-400",
    iconColor: "text-white",
  },
  { key: "Applied", icon: Send, color: "bg-blue-500", iconColor: "text-white" },
  {
    key: "Assessment",
    icon: ClipboardList,
    color: "bg-purple-500",
    iconColor: "text-white",
  },
  {
    key: "Interview",
    icon: Users,
    color: "bg-teal-500",
    iconColor: "text-white",
  },
  { key: "Offer", icon: Award, color: "bg-green-500", iconColor: "text-white" },
];

const STATUS_ORDER = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationTimeline({ applicationId, currentStatus }) {
  const [events, setEvents] = useState([]);
  const statusIdx = STATUS_ORDER.indexOf(currentStatus);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await applicationService.getTimeline(applicationId);
        if (!cancelled) setEvents(data.data);
      } catch {
        // Non-critical — the stage progress still renders without dates.
      }
    }

    if (applicationId) load();
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  // timeline_events comes back ordered most-recent-first, so the first match
  // per status is the latest time that stage was recorded.
  const dateForStatus = (status) =>
    events.find((e) => e.status === status)?.eventDate ?? null;

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-6">
        Application Timeline
      </h3>
      <div className="space-y-6">
        {TIMELINE.map((step, i) => {
          const reached = STATUS_ORDER.indexOf(step.key) <= statusIdx;
          const isCurrent = step.key === currentStatus;
          const isPending = STATUS_ORDER.indexOf(step.key) > statusIdx;
          const eventDate = dateForStatus(step.key);

          return (
            <div key={step.key} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    reached ? step.color : "bg-gray-100 dark:bg-dark-s2",
                  )}
                >
                  <step.icon
                    size={16}
                    className={
                      reached
                        ? step.iconColor
                        : "text-gray-400 dark:text-dark-tx3"
                    }
                  />
                </div>
                {i < TIMELINE.length - 1 && (
                  <div
                    className={cn(
                      "w-px flex-1 mt-2",
                      reached
                        ? "bg-gray-300 dark:bg-dark-border"
                        : "bg-gray-100 dark:bg-dark-s2",
                    )}
                    style={{ minHeight: 20 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      reached
                        ? "text-gray-900 dark:text-dark-tx1"
                        : "text-gray-400 dark:text-dark-tx3",
                    )}
                  >
                    {step.key}
                  </span>

                  {isCurrent && (
                    <span className="text-xs border border-gray-300 dark:border-dark-border text-gray-500 dark:text-dark-tx2 rounded-full px-2 py-0.5">
                      Current
                    </span>
                  )}

                  {isPending && (
                    <span className="text-xs text-gray-400 dark:text-dark-tx3">
                      Pending
                    </span>
                  )}
                </div>

                {/* Real recorded date if we have one, otherwise stay quiet
                    instead of showing made-up text. Reached-but-undated
                    happens for applications created before timeline_events
                    existed, or stages skipped via a status jump. */}
                {reached && (
                  <p className="text-sm mt-0.5 text-gray-500 dark:text-dark-tx2">
                    {eventDate ? `Reached ${formatDate(eventDate)}` : "Date not recorded"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}