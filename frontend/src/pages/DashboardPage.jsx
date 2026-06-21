import { useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardStatCards from '@/components/dashboard/DashboardStatCards'
import ActivityChartCard from '@/components/dashboard/ActivityChartCard'
import FollowUpCard from '@/components/dashboard/FollowUpCard'
import RecentApplicationsTable from '@/components/dashboard/RecentApplicationsTable'
import useAppStore from '@/store/appStore'

export default function DashboardPage() {
  const { fetchApplications, isLoading, applications } = useAppStore()

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  if (isLoading && applications.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="space-y-2">
              <div className="h-7 sm:h-8 w-48 sm:w-64 bg-gray-100 dark:bg-dark-s2 rounded" />
              <div className="h-3.5 w-56 bg-gray-100 dark:bg-dark-s2 rounded" />
            </div>
            <div className="h-3.5 w-32 bg-gray-100 dark:bg-dark-s2 rounded sm:mt-2" />
          </div>

          {/* Stat cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-dark-s1 rounded-2xl p-5 border border-gray-100 dark:border-dark-border h-28"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3.5 w-16 bg-gray-100 dark:bg-dark-s2 rounded" />
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-dark-s2" />
                </div>
                <div className="h-8 w-12 bg-gray-100 dark:bg-dark-s2 rounded" />
              </div>
            ))}
          </div>

          {/* Chart + follow-ups skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-64 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
            <div className="h-64 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
          </div>

          {/* Recent applications skeleton */}
          <div className="h-64 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <DashboardHeader />
        <div id="stats" className="scroll-mt-20">
          <DashboardStatCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div id="activity-chart" className="scroll-mt-20 lg:col-span-2">
            <ActivityChartCard />
          </div>
          <div id="follow-ups" className="scroll-mt-20">
            <FollowUpCard />
          </div>
        </div>

        <div id="recent-applications" className="scroll-mt-20">
          <RecentApplicationsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}