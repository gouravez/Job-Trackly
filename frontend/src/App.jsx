import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import ProtectedRoute, { GuestRoute } from '@/components/common/ProtectedRoute'
import LandingPage            from '@/pages/LandingPage.jsx'
import SignUpPage             from '@/pages/SignUpPage.jsx'
import SignInPage             from '@/pages/SignInPage.jsx'
import AuthCallbackPage       from '@/pages/AuthCallbackPage.jsx'
import DashboardPage          from '@/pages/DashboardPage.jsx'
import ApplicationsPage       from '@/pages/ApplicationsPage.jsx'
import ApplicationDetailPage  from '@/pages/ApplicationDetailPage.jsx'
import KanbanPage             from '@/pages/KanbanPage.jsx'
import AnalyticsPage          from '@/pages/AnalyticsPage.jsx'
import SettingsPage           from '@/pages/SettingsPage.jsx'

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  const { initAuth, isInitializing } = useAuthStore()

  useEffect(() => { initAuth() }, [])

  if (isInitializing && !window.location.pathname.includes('/auth/callback')) return null

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/signup"        element={<GuestRoute><SignUpPage /></GuestRoute>} />
        <Route path="/signin"        element={<GuestRoute><SignInPage /></GuestRoute>} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected */}
        <Route path="/dashboard"        element={<Protected><DashboardPage /></Protected>} />
        <Route path="/applications"     element={<Protected><ApplicationsPage /></Protected>} />
        <Route path="/applications/:id" element={<Protected><ApplicationDetailPage /></Protected>} />
        <Route path="/kanban"           element={<Protected><KanbanPage /></Protected>} />
        <Route path="/analytics"        element={<Protected><AnalyticsPage /></Protected>} />
        <Route path="/settings"         element={<Protected><SettingsPage /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}