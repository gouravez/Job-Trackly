import { Search, SlidersHorizontal } from "lucide-react";

export default function KanbanHeader({ search, onSearch }) {
  return (
    <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-5 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
            Kanban Board
          </h1>
          <p className="text-gray-400 dark:text-dark-tx3 mt-0.5 text-sm">
            Drag and drop to update application status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-tx3"
            />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search applications..."
              className="pl-9 pr-4 h-10 w-48 sm:w-56 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s1 text-sm text-gray-800 dark:text-dark-tx1 placeholder:text-gray-400 dark:placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent shadow-sm transition-all"
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s1 text-gray-500 dark:text-dark-tx3 hover:bg-gray-50 dark:hover:bg-dark-s2 shadow-sm transition-colors">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
