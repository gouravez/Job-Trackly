// frontend/src/pages/ApplicationDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Pencil, ExternalLink } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/common/StatusBadge'
import ApplicationTimeline from '@/components/applicationDetail/ApplicationTimeline'
import ApplicationNotes from '@/components/applicationDetail/ApplicationNotes'
import ActivityHistory from '@/components/applicationDetail/ActivityHistory'
import JobDetailsCard from '@/components/applicationDetail/JobDetailsCard'
import ResumeCard from '@/components/applicationDetail/ResumeCard'
import ContactCard from '@/components/applicationDetail/ContactCard'
import AddApplicationModal from '@/components/applications/AddApplicationModal'
import useAppStore from '@/store/appStore'

export default function ApplicationDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { applications, fetchApplications, updateApplication } = useAppStore()

  const [showEdit,   setShowEdit]   = useState(false)
  const [saveError,  setSaveError]  = useState('')

  // If the store is empty (direct URL navigation), fetch first
  useEffect(() => {
    if (applications.length === 0) fetchApplications()
  }, [])

  const app = applications.find((a) => a.id === Number(id))

  // ── Loading state ────────────────────────────────────────────────────────
  if (!app && applications.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-[3px] border-[#2f54c8] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (!app) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Application not found.</p>
          <Link to="/applications"
            className="text-sm font-semibold text-[#2f54c8] hover:underline">
            ← Back to Applications
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  // ── Edit handler ─────────────────────────────────────────────────────────
  const handleEditSave = async (form) => {
    setSaveError('')
    const result = await updateApplication(app.id, form)
    if (result?.success === false) {
      setSaveError(result.error || 'Failed to update application')
      return
    }
    setShowEdit(false)
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
          <Link to="/applications" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            Applications
          </Link>
          <span>›</span>
          <span className="text-gray-500">{app.company}</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-none">
            {app.role}
          </span>
        </div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
              {app.company[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {app.company}
                </h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">{app.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Edit button — opens modal pre-filled with current app data */}
            <button
              onClick={() => { setSaveError(''); setShowEdit(true) }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Pencil size={13} />
              <span className="hidden sm:inline">Edit Application</span>
              <span className="sm:hidden">Edit</span>
            </button>

            {/* Job posting link — only shown when jobUrl exists */}
            {app.jobUrl ? (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2f54c8] text-white text-xs sm:text-sm font-semibold hover:bg-[#2645b0] transition-colors"
              >
                <span className="hidden sm:inline">Open Job Posting</span>
                <span className="sm:hidden">View Job</span>
                <ExternalLink size={13} />
              </a>
            ) : (
              <button
                disabled
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs sm:text-sm font-semibold cursor-not-allowed"
                title="No job URL saved"
              >
                <span className="hidden sm:inline">No Job URL</span>
                <span className="sm:hidden">No URL</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

          {/* Left — timeline, notes, activity */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <ApplicationTimeline currentStatus={app.status} />
            <ApplicationNotes />
            <ActivityHistory />
          </div>

          {/* Right sidebar */}
          <div className="space-y-4 sm:space-y-5">
            <JobDetailsCard location={app.location} jobType={app.jobType} salary={app.salary} dateApplied={app.dateApplied} />
            <ResumeCard />
            <ContactCard />
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <AddApplicationModal
          initialData={app}
          onClose={() => setShowEdit(false)}
          onSave={handleEditSave}
          saveError={saveError}
        />
      )}
    </DashboardLayout>
  )
}