import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApplicationsFilters from "@/components/applications/ApplicationsFilters";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationsPagination from "@/components/applications/ApplicationsPagination";
import AddApplicationModal from "@/components/applications/AddApplicationModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import useAppStore from "@/store/appStore";

const ROWS_PER_PAGE = 8;
const VALID_STATUSES = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"];

export default function ApplicationsPage() {
  const {
    applications,
    fetchApplications,
    addApplication,
    deleteApplication,
    isLoading,
  } = useAppStore();

  const [searchParams, setSearchParams] = useSearchParams();

  // Allow deep-linking from global search, e.g. /applications?status=Interview&search=google
  const initialStatus = searchParams.get("status");
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(
    VALID_STATUSES.includes(initialStatus) ? initialStatus : "All"
  );
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [saveError, setSaveError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // app object | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch on mount — only if store is empty to avoid redundant calls
  useEffect(() => {
    if (applications.length === 0) fetchApplications();
  }, []);

  // Keep filters in sync if the URL changes (e.g. another search via the
  // global search bar while already on this page)
  useEffect(() => {
    const s = searchParams.get("status");
    const q = searchParams.get("search");
    if (VALID_STATUSES.includes(s) && s !== statusFilter) {
      setStatusFilter(s);
      setPage(1);
    }
    if (q != null && q !== search) {
      setSearch(q);
      setPage(1);
    }
  }, [searchParams]);

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
    // Reflect the filter in the URL so it stays linkable/shareable
    const next = new URLSearchParams(searchParams);
    if (val === "All") next.delete("status");
    else next.set("status", val);
    setSearchParams(next, { replace: true });
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
          <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden animate-pulse">
            {Array.from({ length: ROWS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-50 dark:border-dark-s2 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-s2 flex-shrink-0" />
                  <div className="h-3.5 w-24 sm:w-32 bg-gray-100 dark:bg-dark-s2 rounded" />
                </div>
                <div className="hidden md:block h-3.5 w-28 bg-gray-100 dark:bg-dark-s2 rounded" />
                <div className="hidden md:block h-3.5 w-20 bg-gray-100 dark:bg-dark-s2 rounded" />
                <div className="h-5 w-16 bg-gray-100 dark:bg-dark-s2 rounded-full" />
                <div className="hidden md:block h-3.5 w-16 bg-gray-100 dark:bg-dark-s2 rounded" />
              </div>
            ))}
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