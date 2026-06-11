import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  LayoutGrid,
  Table2,
} from "lucide-react";
import FilterDropdown from "@/components/common/FilterDropdown";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "All",
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];
const SORT_OPTIONS = ["Date Applied", "Company A-Z", "Priority"];
const DATE_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "Last 3 months",
  "All time",
];

export default function ApplicationsFilters({
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[240px]">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-tx3"
        />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by company, role, or location"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s1 text-sm text-gray-800 dark:text-dark-tx1 placeholder:text-gray-400 dark:placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all"
        />
      </div>

      <FilterDropdown
        icon={SlidersHorizontal}
        label={`Status: ${statusFilter}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onStatusFilter(s)}
            className={cn(
              "block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-s3 transition-colors",
              statusFilter === s
                ? "text-dark-accent dark:text-dark-accent3 font-semibold"
                : "text-gray-700 dark:text-dark-tx2",
            )}
          >
            {s}
          </button>
        ))}
      </FilterDropdown>

      <FilterDropdown icon={ArrowUpDown} label="Sort: Date Applied">
        {SORT_OPTIONS.map((s) => (
          <button
            key={s}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s3"
          >
            {s}
          </button>
        ))}
      </FilterDropdown>

      <FilterDropdown icon={Calendar} label="Date Range">
        {DATE_OPTIONS.map((s) => (
          <button
            key={s}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s3"
          >
            {s}
          </button>
        ))}
      </FilterDropdown>

      <div className="flex items-center border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-dark-accent text-white text-sm font-medium">
          <Table2 size={15} /> Table
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 dark:text-dark-tx3 text-sm hover:bg-gray-50 dark:hover:bg-dark-s2">
          <LayoutGrid size={15} />
        </button>
      </div>
    </div>
  );
}
