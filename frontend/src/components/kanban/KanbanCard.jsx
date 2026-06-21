import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
  High: "bg-red-50 text-red-500 border-red-100 dark:bg-dark-red-tint dark:text-red-400 dark:border-red-900/50",
  Medium:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-dark-amber-tint dark:text-amber-400 dark:border-amber-900/50",
  Low: "bg-green-50 text-green-600 border-green-100 dark:bg-dark-green-tint2 dark:text-emerald-400 dark:border-green-900/50",
};

function Avatar({ name }) {
  const palettes = [
    "bg-blue-100 text-blue-700 dark:bg-dark-blue-tint dark:text-dark-accent3",
    "bg-purple-100 text-purple-700 dark:bg-dark-purple-tint dark:text-purple-400",
    "bg-rose-100 text-rose-700 dark:bg-dark-red-tint dark:text-rose-400",
    "bg-amber-100 text-amber-700 dark:bg-dark-amber-tint dark:text-amber-400",
    "bg-green-100 text-green-700 dark:bg-dark-green-tint2 dark:text-emerald-400",
    "bg-teal-100 text-teal-700 dark:bg-dark-teal-tint dark:text-teal-400",
    "bg-indigo-100 text-indigo-700 dark:bg-dark-navy-tint dark:text-indigo-400",
    "bg-pink-100 text-pink-700 dark:bg-dark-pink-tint dark:text-pink-400",
    "bg-sky-100 text-sky-700 dark:bg-[#0a1f2a] dark:text-sky-400",
    "bg-orange-100 text-orange-700 dark:bg-dark-orange-tint dark:text-orange-400",
  ];
  const idx = (name?.charCodeAt(0) || 0) % palettes.length;
  return (
    <div
      className={`w-7 h-7 rounded-full ${palettes[idx]} flex items-center justify-center text-xs font-bold flex-shrink-0`}
    >
      {(name || "??").slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function KanbanCard({ app, columns, onMove }) {
  const [dragging, setDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hasInterview = app.status === "Interview";
  const dateShort = app.dateApplied?.slice(0, 7);

  // Close the move-to menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("cardId", app.id);
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={cn(
        "relative bg-white dark:bg-dark-s2 rounded-xl border border-gray-200 dark:border-dark-border p-3.5 shadow-sm dark:shadow-none",
        "hover:shadow-md dark:hover:border-dark-border2 hover:-translate-y-0.5 transition-all duration-150",
        "cursor-grab active:cursor-grabbing group",
        dragging && "opacity-40 rotate-1 scale-95",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={app.company} />
          <p className="text-sm font-bold text-gray-900 dark:text-dark-tx1 truncate">
            {app.company}
          </p>
        </div>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Move card"
            className={cn(
              "transition-opacity text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx2 ml-1 p-0.5",
              // Always visible on touch (no hover state); fades in on hover for mouse users
              menuOpen ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
            )}
          >
            <MoreHorizontal size={14} />
          </button>

          {/* Move-to menu — the only working way to change status on touch
              devices, since native HTML5 drag-and-drop doesn't fire there */}
          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 w-44 bg-white dark:bg-dark-s1 border border-gray-200 dark:border-dark-border rounded-xl shadow-lg py-1.5">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-tx3">
                Move to
              </p>
              {columns?.map((col) => (
                <button
                  key={col.key}
                  onClick={() => {
                    if (col.key !== app.status) onMove?.(app.id, col.key);
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-left text-gray-700 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                    {col.label}
                  </span>
                  {col.key === app.status && (
                    <Check size={13} className="text-dark-accent dark:text-dark-accent3" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-dark-tx2 mb-3 leading-snug">
        {app.role}
      </p>

      {hasInterview && (
        <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-dark-teal-tint rounded-lg px-2.5 py-1.5 mb-2.5 border border-teal-100 dark:border-teal-900/50">
          <Calendar size={11} />
          <span className="font-medium">Interview</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400 dark:text-dark-tx3">
          {dateShort}
        </span>
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
            PRIORITY_STYLES[app.priority],
          )}
        >
          {app.priority}
        </span>
      </div>
    </div>
  );
}