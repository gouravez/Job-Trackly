import { useParams, Link } from 'react-router-dom'
import { Pencil, ExternalLink } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatusBadge from '@/components/common/StatusBadge'
import ApplicationTimeline from '@/components/applicationDetail/ApplicationTimeline'
import ApplicationNotes from '@/components/applicationDetail/ApplicationNotes'
import ActivityHistory from '@/components/applicationDetail/ActivityHistory'
import JobDetailsCard from '@/components/applicationDetail/JobDetailsCard'
import ResumeCard from '@/components/applicationDetail/ResumeCard'
import ContactCard from '@/components/applicationDetail/ContactCard'
import useAppStore from '@/store/appStore'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const applications = useAppStore((s) => s.applications)
  const app = applications.find((a) => a.id === Number(id)) || applications[0]

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
          <Link to="/applications" className="hover:text-gray-700 transition-colors">Applications</Link>
          <span>›</span>
          <span className="text-gray-500">{app.company}</span>
          <span>›</span>
          <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{app.role}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
              {app.company[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">{app.company}</h1>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-gray-500 mt-0.5 text-sm">{app.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Pencil size={13} />
              <span className="hidden sm:inline">Edit Application</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#2f54c8] text-white text-xs sm:text-sm font-semibold hover:bg-[#2645b0] transition-colors">
              <span className="hidden sm:inline">Open Job Posting</span>
              <span className="sm:hidden">View Job</span>
              <ExternalLink size={13} />
            </button>
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

          {/* Right sidebar — job details, resume, contact */}
          <div className="space-y-4 sm:space-y-5">
            <JobDetailsCard location={app.location} />
            <ResumeCard />
            <ContactCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}