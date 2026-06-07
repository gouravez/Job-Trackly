import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout.jsx'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons.jsx'
import Button from '@/components/ui/Button.jsx'
import Input from '@/components/ui/Input.jsx'
import Logo from '@/components/ui/Logo.jsx'
import useAuthStore from '@/store/authStore'
import { cn } from '@/lib/utils.js'

const FEATURES = [
  'Free forever for students',
  'Track unlimited applications in one place',
  'Visualize your progress with Kanban & analytics',
  'Never miss a follow-up or deadline',
]

const USER_TYPES = ['College Student', 'Recent Graduate', 'Job Seeker']

const PASSWORD_STRENGTH = (pwd) => {
  if (!pwd) return { score: 0, label: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-green-600']
  return { score, label: labels[score], color: colors[score] }
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType]         = useState('College Student')
  const [agreed, setAgreed]             = useState(false)
  const [form, setForm]                 = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors]   = useState({})
  const [authError, setAuthError] = useState('')

  const strength = PASSWORD_STRENGTH(form.password)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = 'Required'
    if (!form.lastName.trim())  newErrors.lastName  = 'Required'
    if (!form.email.trim())     newErrors.email     = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.password) newErrors.password = 'Required'
    else if (form.password.length < 8) newErrors.password = 'Min 8 characters'
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match'
    if (!agreed) newErrors.agreed = 'You must agree to continue'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const result = await signUp({ ...form, userType })
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setAuthError(result.error)
    }
  }

  return (
    <AuthLayout
      headline="Stay on top of every application you send"
      subline="Your personal workspace to organize applications, track progress, and never miss a follow-up."
      features={FEATURES}
    >
      <div className="w-full max-w-[440px] space-y-6">
        <div className="space-y-1">
          <Logo size="lg" />
          <div className="pt-3">
            <h2 className="text-2xl font-bold text-gray-900">Create your free account</h2>
            <p className="text-sm text-gray-500 mt-1">Start organizing your job search in minutes</p>
          </div>
        </div>

        <SocialAuthButtons action="sign up" />

        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" name="firstName" placeholder="Jane" icon={User}
              value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <Input label="Last Name" name="lastName" placeholder="Doe"
              value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </div>

          <Input label="Email" name="email" type="email" placeholder="you@university.edu"
            icon={Mail} value={form.email} onChange={handleChange} error={errors.email} />

          <div className="space-y-1.5">
            <Input label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password" icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword((v) => !v)}
              value={form.password} onChange={handleChange} error={errors.password} />
            {form.password && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className={cn(
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      strength.score >= n
                        ? strength.score <= 1 ? 'bg-red-400'
                          : strength.score === 2 ? 'bg-amber-400'
                          : strength.score === 3 ? 'bg-blue-400'
                          : 'bg-green-500'
                        : 'bg-gray-200'
                    )} />
                  ))}
                </div>
                <span className={cn('text-xs font-medium', strength.color)}>{strength.label}</span>
              </div>
            )}
          </div>

          <Input label="Confirm Password" name="confirmPassword" type="password"
            placeholder="Re-enter your password" icon={Lock}
            value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">
              Where are you in your job search?
            </label>
            <div className="flex gap-2 flex-wrap">
              {USER_TYPES.map((type) => (
                <button key={type} type="button" onClick={() => setUserType(type)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
                    userType === type
                      ? 'bg-[#eef2ff] border-[#2f54c8] text-[#2f54c8]'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((err) => ({ ...err, agreed: '' })) }}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#2f54c8] cursor-pointer" />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-[#2f54c8] hover:underline font-medium">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#2f54c8] hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 mt-1 ml-6">{errors.agreed}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isLoading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/signin" className="text-[#2f54c8] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}