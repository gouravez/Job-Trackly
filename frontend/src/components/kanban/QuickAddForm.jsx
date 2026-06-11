import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuickAddForm({ status, onSave, onCancel }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!company.trim()) return;
    setSaving(true);
    await onSave({
      company: company.trim(),
      role: role.trim() || "Unspecified Role",
      status,
      priority,
      location: "",
      dateApplied: new Date().toISOString().slice(0, 10),
    });
    setSaving(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onCancel();
  };

  const PRIORITY_COLORS = {
    Low: {
      active: "bg-green-500 text-white border-green-500",
      idle: "bg-green-50 text-green-600 border-green-100 dark:bg-dark-green-tint2 dark:text-emerald-400 dark:border-green-900/50",
    },
    Medium: {
      active: "bg-amber-400 text-white border-amber-400",
      idle: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-dark-amber-tint dark:text-amber-400 dark:border-amber-900/50",
    },
    High: {
      active: "bg-red-500 text-white border-red-500",
      idle: "bg-red-50 text-red-500 border-red-100 dark:bg-dark-red-tint dark:text-red-400 dark:border-red-900/50",
    },
  };

  const inputCls =
    "w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-s2 text-sm text-gray-800 dark:text-dark-tx1 placeholder:text-gray-400 dark:placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all";

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-xl border-2 border-dark-accent shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 space-y-2.5">
      <input
        autoFocus
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Company name *"
        className={inputCls}
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Job role"
        className={inputCls}
      />
      <div className="flex gap-1.5">
        {["Low", "Medium", "High"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={cn(
              "flex-1 text-xs font-semibold py-1 rounded-lg border transition-all",
              priority === p
                ? PRIORITY_COLORS[p].active
                : PRIORITY_COLORS[p].idle,
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={handleSave}
          disabled={!company.trim() || saving}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-dark-accent text-white text-xs font-semibold hover:bg-dark-accent2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Check size={13} /> {saving ? "Saving…" : "Add Card"}
        </button>
        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-dark-border text-gray-400 dark:text-dark-tx3 hover:bg-gray-50 dark:hover:bg-dark-s2 hover:text-gray-700 dark:hover:text-dark-tx2 transition-all"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
