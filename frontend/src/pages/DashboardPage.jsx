import { useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardStatCards from '@/components/dashboard/DashboardStatCards'
import ActivityChartCard from '@/components/dashboard/ActivityChartCard'
import FollowUpCard from '@/components/dashboard/FollowUpCard'
import RecentApplicationsTable from '@/components/dashboard/RecentApplicationsTable'
import useAppStore from '@/store/appStore'

export default function DashboardPage() {
  const fetchApplications = useAppStore((s) => s.fetchApplications)

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

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