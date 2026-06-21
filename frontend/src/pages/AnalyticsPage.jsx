import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnalyticsStatCards from "@/components/analytics/AnalyticsStatCards";
import MonthlyTrendsChart from "@/components/analytics/MonthlyTrendsChart";
import StatusBreakdownChart from "@/components/analytics/StatusBreakdownChart";
import ApplicationFunnel from "@/components/analytics/ApplicationFunnel";
import TopCompaniesChart from "@/components/analytics/TopCompaniesChart";
import useAppStore from "@/store/appStore";

export default function AnalyticsPage() {
  const { fetchApplications, applications, isLoading } = useAppStore();

  useEffect(() => {
    if (applications.length === 0) fetchApplications();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
              Analytics
            </h1>
            <p className="text-gray-400 dark:text-dark-tx2 mt-0.5 text-sm">
              Track your job search performance
            </p>
          </div>
          <button className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s1 text-sm text-gray-600 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2 transition-colors whitespace-nowrap">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="hidden sm:inline">Last 6 Months</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Loading */}
        {isLoading && applications.length === 0 ? (
          <div className="space-y-4 sm:space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 h-64 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
              <div className="lg:col-span-2 h-64 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-56 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
              <div className="h-56 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
            </div>
          </div>
        ) : (
          <>
            <div id="analytics-stats" className="scroll-mt-20">
              <AnalyticsStatCards />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div id="monthly-trends" className="scroll-mt-20 lg:col-span-3">
                <MonthlyTrendsChart />
              </div>
              <div id="status-breakdown" className="scroll-mt-20 lg:col-span-2">
                <StatusBreakdownChart />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div id="funnel" className="scroll-mt-20">
                <ApplicationFunnel />
              </div>
              <div id="top-companies" className="scroll-mt-20">
                <TopCompaniesChart />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}