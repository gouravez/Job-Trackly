import { useState } from 'react'
import { User, Palette, Shield, Sun, Moon, Monitor, Check, Eye, EyeOff } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useAuthStore from '@/store/authStore'
import useThemeStore from '@/store/themeStore'
import { userService } from '@/services/api'
import { cn } from '@/lib/utils'

// ── Shared primitives ────────────────────────────────────────────────────────

function Input({ label, type = 'text', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        type={type}
        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] focus:bg-white dark:focus:bg-gray-700 transition-all"
        {...props}
      />
    </div>
  )
}

function Card({ title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

function SaveButton({ saved, onClick }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
          saved ? 'bg-green-500 text-white' : 'bg-[#2f54c8] hover:bg-[#2645b0] text-white'
        )}
      >
        {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
      </button>
    </div>
  )
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'profile',    label: 'Profile',    icon: User    },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'account',   label: 'Account',    icon: Shield  },
]

// ── Profile section ───────────────────────────────────────────────────────────

function ProfileSection() {
  const { user } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    firstName:      user?.firstName      || '',
    lastName:       user?.lastName       || '',
    email:          user?.email          || '',
    university:     user?.university     || '',
    graduationYear: user?.graduationYear || '',
    userType:       user?.userType       || 'College Student',
    linkedin:       user?.linkedin       || '',
    github:         user?.github         || '',
    portfolio:      user?.portfolio      || '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || '?'

  const handleSave = async () => {
    try {
      await userService.updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Profile update failed:', err)
    }
  }

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <Card title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#2f54c8] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{form.email}</p>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card title="Personal Info" description="Your name and email address">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="First name" />
          <Input label="Last Name"  value={form.lastName}  onChange={(e) => set('lastName', e.target.value)}  placeholder="Last name"  />
        </div>
        <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
        <SaveButton saved={saved} onClick={handleSave} />
      </Card>

      {/* Academic info */}
      <Card title="Academic Info" description="Your education details">
        <div className="grid grid-cols-2 gap-4">
          <Input label="University" value={form.university} onChange={(e) => set('university', e.target.value)} placeholder="e.g. UC Berkeley" />
          <Input label="Graduation Year" value={form.graduationYear} onChange={(e) => set('graduationYear', e.target.value)} placeholder="e.g. 2026" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Search Status</label>
          <select
            value={form.userType}
            onChange={(e) => set('userType', e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all"
          >
            {['College Student', 'Recent Graduate', 'Job Seeker'].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <SaveButton saved={saved} onClick={handleSave} />
      </Card>

      {/* Social links */}
      <Card title="Social Links">
        <Input label="LinkedIn"  value={form.linkedin}  onChange={(e) => set('linkedin', e.target.value)}  placeholder="https://linkedin.com/in/..." />
        <Input label="GitHub"    value={form.github}    onChange={(e) => set('github', e.target.value)}    placeholder="https://github.com/..."      />
        <Input label="Portfolio" value={form.portfolio} onChange={(e) => set('portfolio', e.target.value)} placeholder="https://yoursite.com"         />
        <SaveButton saved={saved} onClick={handleSave} />
      </Card>
    </div>
  )
}

// ── Appearance section ────────────────────────────────────────────────────────

function AppearanceSection() {
  const { theme, setTheme } = useThemeStore()

  const THEMES = [
    { key: 'light',  label: 'Light',  icon: Sun     },
    { key: 'dark',   label: 'Dark',   icon: Moon    },
    { key: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="space-y-5">
      <Card title="Theme" description="Choose how Job Trackly looks for you">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                theme === key
                  ? 'border-[#2f54c8] bg-[#eef2ff] dark:bg-[#2f54c8]/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
              )}
            >
              <Icon size={20} className={theme === key ? 'text-[#2f54c8]' : 'text-gray-400'} />
              <span className={cn('text-sm font-medium', theme === key ? 'text-[#2f54c8]' : 'text-gray-500 dark:text-gray-400')}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Account section ───────────────────────────────────────────────────────────

function AccountSection() {
  const { logout } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [saved, setSaved] = useState(false)
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')

  const set = (k, v) => setPwd((p) => ({ ...p, [k]: v }))

  const handlePasswordSave = async () => {
    setError('')
    if (!pwd.current)             return setError('Enter your current password.')
    if (pwd.next.length < 8)      return setError('New password must be at least 8 characters.')
    if (pwd.next !== pwd.confirm) return setError('Passwords do not match.')

    try {
      await userService.changePassword({ currentPassword: pwd.current, newPassword: pwd.next })
      setSaved(true)
      setPwd({ current: '', next: '', confirm: '' })
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password.')
    }
  }

  return (
    <div className="space-y-5">
      <Card title="Change Password" description="Update your login password">
        <div className="relative">
          <Input
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
          <Input
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

        <Input
          label="Confirm New Password"
          type="password"
          value={pwd.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          placeholder="Re-enter new password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <SaveButton saved={saved} onClick={handlePasswordSave} />
      </Card>

      {/* Danger zone */}
      <Card title="Danger Zone">
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
      </Card>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const SECTION_MAP = {
  profile:    ProfileSection,
  appearance: AppearanceSection,
  account:    AccountSection,
}

export default function SettingsPage() {
  const [active, setActive] = useState('profile')
  const ActiveSection = SECTION_MAP[active]

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header — matches other pages */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-400 mt-0.5 text-sm">Manage your account and preferences</p>
        </div>

        {/* Tab bar — matches page-level filter style */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                active === key
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        {/* Active section */}
        <ActiveSection />
      </div>
    </DashboardLayout>
  )
}