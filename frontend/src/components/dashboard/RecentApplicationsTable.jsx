import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus } from "lucide-react";
import CompanyAvatar from "@/components/common/CompanyAvatar";
import StatusBadge from "@/components/common/StatusBadge";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import useAppStore from "@/store/appStore";
import { formatDate } from "@/lib/utils";

export default function RecentApplicationsTable() {
  const { applications, updateApplication } = useAppStore();
  const recent = applications.slice(0, 5);

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

  return (
    <>
      <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50 dark:border-dark-s3">
          <h3 className="font-bold text-gray-900 dark:text-dark-tx1 text-sm sm:text-base">
            Recent Applications
          </h3>
          <Link to="/applications">
            <button className="flex items-center gap-1.5 text-sm text-dark-accent dark:text-dark-accent3 font-medium hover:underline">
              <Plus size={15} /> New
            </button>
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400 dark:text-dark-tx3">
            No applications yet —{" "}
            <Link
              to="/applications"
              className="text-dark-accent dark:text-dark-accent3 hover:underline"
            >
              add your first one
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 dark:text-dark-tx3 uppercase tracking-wide border-b border-gray-50 dark:border-dark-s3">
                    {[
                      "Company",
                      "Role",
                      "Status",
                      "Date Applied",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="text-left px-6 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 dark:border-dark-s2 hover:bg-gray-50/50 dark:hover:bg-dark-s2 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <CompanyAvatar name={app.company} size="sm" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-dark-tx1">
                            {app.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-tx2">
                        {app.role}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-tx2">
                        {formatDate(app.dateApplied)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50 dark:divide-dark-s2">
              {recent.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between px-4 py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={app.status} />
                    <Link to={`/applications/${app.id}`}>
                      <Eye
                        size={14}
                        className="text-gray-400 dark:text-dark-tx3"
                      />
                    </Link>
                    <button
                      onClick={() => {
                        setSaveError("");
                        setEditingApp(app);
                      }}
                      className="text-gray-400 dark:text-dark-tx3 hover:text-dark-accent dark:hover:text-dark-accent3 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
