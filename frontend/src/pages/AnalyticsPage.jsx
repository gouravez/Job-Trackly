import { ChevronDown } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AnalyticsStatCards from '@/components/analytics/AnalyticsStatCards'
import MonthlyTrendsChart from '@/components/analytics/MonthlyTrendsChart'
import StatusBreakdownChart from '@/components/analytics/StatusBreakdownChart'
import ApplicationFunnel from '@/components/analytics/ApplicationFunnel'
import TopCompaniesChart from '@/components/analytics/TopCompaniesChart'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Analytics</h1>
            <p className="text-gray-400 mt-0.5 text-sm">Track your job search performance</p>
          </div>
          <button className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="hidden sm:inline">Last 6 Months</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Stat cards */}
        <AnalyticsStatCards />

        {/* Bar chart + Donut — stacked on mobile, side by side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <MonthlyTrendsChart />
          <StatusBreakdownChart />
        </div>

        {/* Funnel + Top Companies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ApplicationFunnel />
          <TopCompaniesChart />
        </div>
      </div>
    </DashboardLayout>
  )
}