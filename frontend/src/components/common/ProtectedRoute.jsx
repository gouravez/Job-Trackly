import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

// ---------------------------------------------------------------------------
// ProtectedRoute — wraps any route that requires authentication.
// Redirects to /signin with the originally-requested path saved in state
// so the user can be redirected back after signing in.
// ---------------------------------------------------------------------------

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}