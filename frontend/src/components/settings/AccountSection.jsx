// frontend/src/components/settings/AccountSection.jsx
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import { userService } from '@/services/api'
import { SettingsInput, SettingsCard, SaveButton } from './SettingsPrimitives'

export default function AccountSection() {
  const { logout } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [pwd,  setPwd]   = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')

  const set = (k, v) => setPwd((p) => ({ ...p, [k]: v }))

  const handlePasswordSave = async () => {
    setError('')
    if (!pwd.current)             return setError('Enter your current password.')
    if (pwd.next.length < 8)      return setError('New password must be at least 8 characters.')
    if (pwd.next !== pwd.confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await userService.changePassword({ currentPassword: pwd.current, newPassword: pwd.next })
      setSaved(true)
      setPwd({ current: '', next: '', confirm: '' })
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">

      <SettingsCard title="Change Password" description="Update your login password">

        <div className="relative">
          <SettingsInput
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            value={pwd.current}
            onChange={(e) => set('current', e.target.value)}
            placeholder="Enter current password"
          />
          <button
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="relative">
          <SettingsInput
            label="New Password"
            type={showNew ? 'text' : 'password'}
            value={pwd.next}
            onChange={(e) => set('next', e.target.value)}
            placeholder="Minimum 8 characters"
          />
          <button
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          >
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <SettingsInput
          label="Confirm New Password"
          type="password"
          value={pwd.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          placeholder="Re-enter new password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <SaveButton saved={saved} loading={loading} onClick={handlePasswordSave} />
      </SettingsCard>

      <SettingsCard title="Danger Zone">
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Sign out of all devices</p>
            <p className="text-xs text-red-400 mt-0.5">Revokes all active sessions</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </SettingsCard>

    </div>
  )
}