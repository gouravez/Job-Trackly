import { MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function JobDetailsCard({
  location,
  jobType,
  salary,
  dateApplied,
}) {
  const details = [
    { icon: MapPin, label: "Location", value: location || "—" },
    { icon: Briefcase, label: "Job Type", value: jobType || "—" },
    { icon: DollarSign, label: "Salary Range", value: salary || "—" },
    { icon: Calendar, label: "Date Applied", value: formatDate(dateApplied) },
  ];

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-4">
        Job Details
      </h3>
      <div className="space-y-1">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-dark-s2 last:border-0"
          >
            <div className="flex items-center gap-2">
              <Icon size={14} className="text-gray-400 dark:text-dark-tx3" />
              <span className="text-sm text-gray-500 dark:text-dark-tx2">
                {label}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-dark-tx1">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
