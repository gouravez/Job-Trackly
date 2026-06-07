import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import LandingPage from '@/pages/LandingPage.jsx'
import SignUpPage from '@/pages/SignUpPage.jsx'
import SignInPage from '@/pages/SignInPage.jsx'
import DashboardPage from '@/pages/DashboardPage.jsx'
import ApplicationsPage from '@/pages/ApplicationsPage.jsx'
import ApplicationDetailPage from '@/pages/ApplicationDetailPage.jsx'
import KanbanPage from '@/pages/KanbanPage.jsx'
import AnalyticsPage from '@/pages/AnalyticsPage.jsx'
import SettingsPage from '@/pages/SettingsPage.jsx'

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* Protected routes */}
        {/* <Route path="/dashboard"           element={<Protected><DashboardPage /></Protected>} />
        <Route path="/applications"        element={<Protected><ApplicationsPage /></Protected>} />
        <Route path="/applications/:id"    element={<Protected><ApplicationDetailPage /></Protected>} />
        <Route path="/kanban"              element={<Protected><KanbanPage /></Protected>} />
        <Route path="/analytics"           element={<Protected><AnalyticsPage /></Protected>} />
        <Route path="/settings"            element={<Protected><SettingsPage /></Protected>} /> */}
        <Route path="/dashboard"           element={<DashboardPage />} />
        <Route path="/applications"        element={<ApplicationsPage />} />
        <Route path="/applications/:id"    element={<ApplicationDetailPage />} />
        <Route path="/kanban"              element={<KanbanPage />} />
        <Route path="/analytics"           element={<AnalyticsPage />} />
        <Route path="/settings"            element={<SettingsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}