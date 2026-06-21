import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import ProtectedRoute, { GuestRoute } from '@/components/common/ProtectedRoute'
import { GLOBAL_CSS, ScrollProgressBar, CustomCursor } from '@/effects/GlobalEffects.jsx'
import LandingPage            from '@/pages/LandingPage.jsx'
import SignUpPage             from '@/pages/SignUpPage.jsx'
import ForgotPasswordPage from "@/pages/ForgotPasswordPage.jsx";
import SignInPage             from '@/pages/SignInPage.jsx'
import AuthCallbackPage       from '@/pages/AuthCallbackPage.jsx'
import DashboardPage          from '@/pages/DashboardPage.jsx'
import ApplicationsPage       from '@/pages/ApplicationsPage.jsx'
import ApplicationDetailPage  from '@/pages/ApplicationDetailPage.jsx'
import KanbanPage             from '@/pages/KanbanPage.jsx'
import AnalyticsPage          from '@/pages/AnalyticsPage.jsx'
import SettingsPage           from '@/pages/SettingsPage.jsx'
import CalendarPage from '@/pages/CalendarPage.jsx'
import ReferralPage from '@/pages/ReferralPage.jsx'

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  const { initAuth, isInitializing } = useAuthStore()

  useEffect(() => { initAuth() }, [])

  if (isInitializing && !window.location.pathname.includes('/auth/callback')) return null

  return (
    <BrowserRouter>
      {/* Global cursor + click sound/ripple + scroll progress bar —
          mounted once here so every page (not just the landing page)
          gets the same hover/click feel. */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <ScrollProgressBar />
      <CustomCursor />

      <Routes>
        {/* Public */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/signup"        element={<GuestRoute><SignUpPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signin"        element={<GuestRoute><SignInPage /></GuestRoute>} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected */}
        <Route path="/dashboard"        element={<Protected><DashboardPage /></Protected>} />
        <Route path="/applications"     element={<Protected><ApplicationsPage /></Protected>} />
        <Route path="/applications/:id" element={<Protected><ApplicationDetailPage /></Protected>} />
        <Route path="/kanban"           element={<Protected><KanbanPage /></Protected>} />
        <Route path="/analytics"        element={<Protected><AnalyticsPage /></Protected>} />
        <Route path="/settings"         element={<Protected><SettingsPage /></Protected>} />
        <Route path="/calendar" element={<Protected><CalendarPage /></Protected>} />
        <Route path="/referrals" element={<Protected><ReferralPage /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}