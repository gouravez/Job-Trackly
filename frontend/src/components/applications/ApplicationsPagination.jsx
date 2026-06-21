import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplicationsPagination({
  page,
  totalPages,
  filtered,
  ROWS_PER_PAGE,
  setPage,
}) {
  if (filtered.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-50 dark:border-dark-s3 bg-white dark:bg-dark-s1">
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-dark-tx2">
        Rows per page
        <select className="border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s2 text-gray-700 dark:text-dark-tx2 rounded-lg px-2 py-1 text-sm ml-1 focus:outline-none">
          <option>8</option>
          <option>16</option>
          <option>32</option>
        </select>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-1 text-sm text-gray-500 dark:text-dark-tx2">
        <span className="mr-auto sm:mr-2 whitespace-nowrap">
          {(page - 1) * ROWS_PER_PAGE + 1}–
          {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
        </span>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-s2 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbered page buttons: only shown from sm up — on mobile up to 7
            buttons plus the rest of this row can't fit without overflowing,
            so phones just get prev/next + the "X–Y of Z" range above. */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                  page === n
                    ? "bg-dark-accent text-white"
                    : "hover:bg-gray-100 dark:hover:bg-dark-s2 text-gray-600 dark:text-dark-tx2",
                )}
              >
                {n}
              </button>
            ),
          )}
          {totalPages > 5 && <span className="px-1">…</span>}
          {totalPages > 5 && (
            <button
              onClick={() => setPage(totalPages)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                page === totalPages
                  ? "bg-dark-accent text-white"
                  : "hover:bg-gray-100 dark:hover:bg-dark-s2 text-gray-600 dark:text-dark-tx2",
              )}
            >
              {totalPages}
            </button>
          )}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-s2 disabled:opacity-40 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}