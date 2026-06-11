import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CompanyAvatar from "@/components/common/CompanyAvatar";
import StatusBadge from "@/components/common/StatusBadge";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import { PRIORITY_COLORS } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import useAppStore from "@/store/appStore";

const COLUMNS = [
  "Company",
  "Role",
  "Location",
  "Status",
  "Date Applied",
  "Priority",
  "Actions",
];

export default function ApplicationsTable({ applications, onDelete }) {
  const { updateApplication } = useAppStore();
  const [editingApp, setEditingApp] = useState(null);
  const [saveError, setSaveError] = useState("");

  const handleEditSave = async (form) => {
    setSaveError("");
    const result = await updateApplication(editingApp.id, form);
    if (result?.success === false) {
      setSaveError(result.error || "Failed to update application");
      return;
    }
    setEditingApp(null);
  };

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-gray-400 dark:text-dark-tx3">
        No applications match your filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-dark-tx3 uppercase tracking-wider border-b border-gray-100 dark:border-dark-s3">
              {COLUMNS.map((h) => (
                <th key={h} className="text-left px-5 py-3.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const p =
                PRIORITY_COLORS[app.priority] || PRIORITY_COLORS["Medium"];
              return (
                <tr
                  key={app.id}
                  className="border-b border-gray-50 dark:border-dark-s2 hover:bg-gray-50/60 dark:hover:bg-dark-s2 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <CompanyAvatar name={app.company} size="sm" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-dark-tx1">
                        {app.company}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-dark-tx2">
                    {app.role}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-dark-tx2">
                    {app.location || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-dark-tx2">
                    {formatDate(app.dateApplied)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                      <span className={`text-sm font-medium ${p.text}`}>
                        {app.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link to={`/applications/${app.id}`}>
                        <button className="text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx1 transition-colors">
                          <Eye size={15} />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setSaveError("");
                          setEditingApp(app);
                        }}
                        className="text-gray-400 dark:text-dark-tx3 hover:text-dark-accent dark:hover:text-dark-accent3 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(app)}
                        className="text-gray-400 dark:text-dark-tx3 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-dark-s2">
        {applications.map((app) => {
          const p = PRIORITY_COLORS[app.priority] || PRIORITY_COLORS["Medium"];
          return (
            <div key={app.id} className="px-4 py-3.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyAvatar name={app.company} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1 truncate">
                      {app.company}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-dark-tx3 truncate">
                      {app.role}
                    </p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-dark-tx3">
                  <span>{formatDate(app.dateApplied)}</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                    <span className={p.text}>{app.priority}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/applications/${app.id}`}>
                    <button className="text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx1">
                      <Eye size={14} />
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setSaveError("");
                      setEditingApp(app);
                    }}
                    className="text-gray-400 dark:text-dark-tx3 hover:text-dark-accent dark:hover:text-dark-accent3"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    className="text-gray-400 dark:text-dark-tx3 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editingApp && (
        <AddApplicationModal
          initialData={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={handleEditSave}
          saveError={saveError}
        />
      )}
    </>
  );
}