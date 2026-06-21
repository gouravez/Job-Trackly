import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shows the application's real `notes` field (was previously hardcoded).
// Click the pencil to edit inline; Save calls onSave(newNotes), which the
// parent wires to updateApplication(app.id, { notes }).
// ---------------------------------------------------------------------------
export default function ApplicationNotes({ notes, updatedAt, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setDraft(notes || "");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const result = await onSave(draft);
    setSaving(false);
    if (result?.success === false) {
      setError(result.error || "Failed to save notes");
      return;
    }
    setIsEditing(false);
  };

  const updatedLabel = updatedAt
    ? `${formatDate(updatedAt)} · ${new Date(updatedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`
    : null;

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1">Notes</h3>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx1 transition-colors"
            aria-label="Edit notes"
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            autoFocus
            placeholder="Add notes about this application..."
            className="w-full text-sm text-gray-700 dark:text-dark-tx2 bg-gray-50 dark:bg-dark-s2 rounded-xl p-4 border border-gray-200 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-dark-accent resize-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-accent text-white text-xs font-semibold hover:bg-dark-accent-dim transition-colors disabled:opacity-60"
            >
              <Check size={13} />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEditing}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border text-xs font-medium text-gray-600 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2 transition-colors"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 dark:bg-dark-s2 rounded-xl p-4">
            <p className="text-sm text-gray-700 dark:text-dark-tx2 leading-relaxed whitespace-pre-wrap">
              {notes || "No notes yet — click the pencil to add some."}
            </p>
          </div>
          {updatedLabel && (
            <p className="text-xs text-gray-400 dark:text-dark-tx3 mt-3">
              Last edited {updatedLabel}
            </p>
          )}
        </>
      )}
    </div>
  );
}