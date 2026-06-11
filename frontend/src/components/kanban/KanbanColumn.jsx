import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import KanbanCard from "./KanbanCard";
import QuickAddForm from "./QuickAddForm";

export default function KanbanColumn({
  col,
  cards,
  isOver,
  isAdding,
  onDragOver,
  onDragLeave,
  onDrop,
  onAddCard,
  onToggleAdd,
}) {
  return (
    <div
      className="w-[220px] flex flex-col flex-shrink-0"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "bg-white dark:bg-dark-s1 rounded-xl border border-gray-200 dark:border-dark-border border-t-4 px-3.5 py-3 mb-3 flex items-center justify-between shadow-sm dark:shadow-none",
          col.topBorder,
        )}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-sm font-bold text-gray-800 dark:text-dark-tx1">
            {col.label}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            col.badge,
          )}
        >
          {cards.length}
        </span>
      </div>

      <div
        className={cn(
          "flex-1 rounded-xl p-1.5 space-y-2.5 overflow-y-auto transition-all duration-150",
          isOver
            ? "bg-[#eef2ff] dark:bg-dark-blue-tint ring-2 ring-dark-accent/30 ring-inset"
            : "bg-gray-50/80 dark:bg-dark-s1/60",
        )}
      >
        {isAdding && (
          <QuickAddForm
            status={col.key}
            onSave={onAddCard}
            onCancel={() => onToggleAdd(null)}
          />
        )}

        {cards.length === 0 && !isAdding && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-300 dark:text-dark-border italic">
            No applications
          </div>
        )}

        {cards.map((app) => (
          <KanbanCard key={app.id} app={app} />
        ))}
      </div>

      <button
        onClick={() => onToggleAdd(isAdding ? null : col.key)}
        className={cn(
          "mt-2.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border border-dashed transition-all",
          isAdding
            ? "border-dark-accent text-dark-accent dark:text-dark-accent3 bg-[#eef2ff] dark:bg-dark-blue-tint"
            : "border-gray-200 dark:border-dark-border text-gray-400 dark:text-dark-tx3 hover:text-dark-accent dark:hover:text-dark-accent3 hover:border-dark-accent dark:hover:border-dark-accent hover:bg-white dark:hover:bg-dark-s1",
        )}
      >
        <Plus size={12} />
        {isAdding ? "Cancel" : "Add card"}
      </button>
    </div>
  );
}
