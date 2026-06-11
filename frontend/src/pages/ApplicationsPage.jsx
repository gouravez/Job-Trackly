import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationsPagination from "@/components/applications/ApplicationsPagination";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import useAppStore from "@/store/appStore";

const ROWS_PER_PAGE = 8;

export default function ApplicationsPage() {
  const {
    applications,
    fetchApplications,
    addApplication,
    deleteApplication,
    isLoading,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [saveError, setSaveError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // app object | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch on mount — only if store is empty to avoid redundant calls
  useEffect(() => {
    if (applications.length === 0) fetchApplications();
  }, []);

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (a.company || "").toLowerCase().includes(q) ||
      (a.role || "").toLowerCase().includes(q) ||
      (a.location || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  // addApplication now calls the real API — no fake id needed
  const handleSave = async (form) => {
    setSaveError("");
    const result = await addApplication(form);
    if (result?.success === false) {
      setSaveError(result.error || "Failed to add application");
      return;
    }
    setShowModal(false);
  };

  const handleDeleteRequest = (app) => {
    setConfirmDelete(app);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    await deleteApplication(confirmDelete.id);
    setDeleteLoading(false);
    setConfirmDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
              My Applications
            </h1>
            <p className="text-gray-400 dark:text-dark-tx2 mt-0.5 text-sm">
              {isLoading ? "Loading…" : `${filtered.length} Applications`}
            </p>
          </div>
          <button
            onClick={() => {
              setSaveError("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Filters */}
        <ApplicationsFilters
          search={search}
          onSearch={handleSearch}
          statusFilter={statusFilter}
          onStatusFilter={handleStatusFilter}
        />

        {/* Loading skeleton */}
        {isLoading && applications.length === 0 ? (
          <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-12 text-center">
            <div className="w-8 h-8 border-[3px] border-dark-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading applications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">
              {search || statusFilter !== "All"
                ? "No applications match your filters."
                : "No applications yet — add your first one!"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">
            <ApplicationsTable
              applications={paginated}
              onDelete={handleDeleteRequest}
            />
            <ApplicationsPagination
              page={page}
              totalPages={totalPages}
              filtered={filtered}
              ROWS_PER_PAGE={ROWS_PER_PAGE}
              setPage={setPage}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete application?"
        message="This will permanently remove the application and all its history. This cannot be undone."
        confirmLabel="Delete"
        application={confirmDelete}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />

      {showModal && (
        <AddApplicationModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          saveError={saveError}
        />
      )}
    </DashboardLayout>
  );
}