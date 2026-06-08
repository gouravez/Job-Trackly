import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

// Wraps routes that require authentication.
// Redirects to /signin with the original path saved so the user
// is sent back after logging in.
export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}

// Redirects already-authenticated users away from /signin and /signup.
export function GuestRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/dashboard" replace />
  return children
}