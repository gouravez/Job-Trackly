import { useEffect, useRef } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import CompanyAvatar from "@/components/common/CompanyAvatar";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const VARIANT = {
  danger: {
    bar: "bg-red-500",
    iconBg: "bg-red-50 dark:bg-red-900/20",
    icon: Trash2,
    iconColor: "text-red-500",
    btn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    bar: "bg-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
};

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  // Optional application preview card
  application,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);
  const v = VARIANT[variant] || VARIANT.danger;
  const Icon = v.icon;

  useEffect(() => {
    if (open) setTimeout(() => confirmRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-dark-s1 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border w-full max-w-[420px] overflow-hidden">
        {/* Coloured top bar */}
        <div className={cn("h-1 w-full", v.bar)} />

        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-dark-tx1 hover:bg-gray-100 dark:hover:bg-dark-s2 transition-colors disabled:opacity-40"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-5 pb-0 space-y-4">
          {/* Icon + title + message */}
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                v.iconBg,
              )}
            >
              <Icon size={19} className={v.iconColor} />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <p className="text-[15px] font-bold text-gray-900 dark:text-dark-tx1 leading-snug">
                {title}
              </p>
              {message && (
                <p className="text-sm text-gray-500 dark:text-dark-tx2 mt-1 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Application preview chip */}
          {application && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-s2 border border-gray-100 dark:border-dark-border rounded-xl px-3.5 py-3">
              <CompanyAvatar name={application.company} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1 truncate">
                  {application.company}
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-tx2 truncate">
                  {application.role}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={application.status} />
                {application.dateApplied && (
                  <span className="text-xs text-gray-400 dark:text-dark-tx2 hidden sm:block">
                    {formatDate(application.dateApplied)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-5 border-t border-gray-100 dark:border-dark-border" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-s2 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60",
              v.btn,
            )}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <Icon size={14} />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
