import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export default function AuthCallbackPage() {
  const navigate    = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    // Read directly from window.location — avoids any React Router parsing issues
    const raw   = window.location.search
    const params = new URLSearchParams(raw)
    const token  = params.get('token')
    const user   = params.get('user')

    // console.log('raw search:', raw)
    // console.log('token:', token ? 'present' : 'missing')
    // console.log('user:', user)

    if (!token || !user) {
      // console.error('Missing token or user')
      navigate('/signin?error=google', { replace: true })
      return
    }

    try {
      const padded = user + '=='.slice(0, (4 - (user.length % 4)) % 4)
      const parsed = JSON.parse(atob(padded))
      // console.log('parsed user:', parsed)
      localStorage.setItem('token', token)
      setAuth({ token, user: parsed })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Decode error:', err)
      navigate('/signin?error=google', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-[#2f54c8] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Signing you in…</p>
      </div>
    </div>
  )
}