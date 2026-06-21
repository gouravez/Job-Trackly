import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import api from '@/services/api'

// ---------------------------------------------------------------------------
// AuthCallbackPage — landed here after Google OAuth redirect.
//
// Previously the JWT was passed as ?token= in the URL, which leaks it into
// browser history, server logs, and Referer headers. Now the URL only carries
// an opaque short-lived ?code= (32-byte random hex, 60 s TTL, single-use).
// We POST that code to /api/auth/google/token and receive the JWT over HTTPS,
// never visible in the URL.
// ---------------------------------------------------------------------------

export default function AuthCallbackPage() {
  const navigate  = useNavigate()
  const { setAuth } = useAuthStore()
  const called = useRef(false) // prevent StrictMode double-invoke

  useEffect(() => {
    if (called.current) return
    called.current = true

    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')

    if (!code) {
      navigate('/signin?error=google', { replace: true })
      return
    }

    api
      .post('/auth/google/token', { code })
      .then(({ data }) => {
        const { token, user } = data.data
        setAuth({ token, user })
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        navigate('/signin?error=google', { replace: true })
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-dark-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-dark-tx2">
          Signing you in…
        </p>
      </div>
    </div>
  )
}