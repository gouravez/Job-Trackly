import { useState } from 'react'
import {
  User, Bell, Palette, Shield, Download, Trash2, Globe, Moon, Sun,
  Monitor, Mail, Eye, EyeOff, Check, ChevronRight, LogOut, Camera,
  Link as LinkIcon,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn } from '@/lib/utils'

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2f54c8] focus:ring-offset-2', checked ? 'bg-[#2f54c8]' : 'bg-gray-200')}>
      <span className={cn('pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200', checked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  )
}
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
        {description && <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">{children}</div>
    </div>
  )
}
function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
function Divider() { return <div className="h-px bg-gray-50" /> }
function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] focus:bg-white transition-all" {...props} />
    </div>
  )
}
function Select({ label, options, value, onChange }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all">
        {options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  )
}

const TABS = [
  { key: 'profile',       label: 'Profile',           icon: User     },
  { key: 'appearance',    label: 'Appearance',         icon: Palette  },
  { key: 'notifications', label: 'Notifications',      icon: Bell     },
  { key: 'privacy',       label: 'Privacy & Security', icon: Shield   },
  { key: 'integrations',  label: 'Integrations',       icon: LinkIcon },
  { key: 'data',          label: 'Data & Export',      icon: Download },
]

function ProfileSection() {
  const [form, setForm] = useState({ firstName:'Jane', lastName:'Doe', email:'jane@mail.com', phone:'', location:'San Francisco, CA', bio:'', jobTitle:'Software Engineer Intern', university:'UC Berkeley', graduationYear:'2025', linkedin:'', github:'', portfolio:'' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Profile Photo</h3>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2f54c8] flex items-center justify-center text-white text-xl sm:text-2xl font-bold">JD</div>
            <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"><Camera size={12} /></button>
          </div>
          <div>
            <button className="px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Upload new photo</button>
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · Max 2MB</p>
          </div>
        </div>
      </div>
      <SectionCard title="Personal Info" description="Update your name and contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
          <Input label="Last Name"  value={form.lastName}  onChange={(e) => set('lastName', e.target.value)} />
        </div>
        <Input label="Email Address" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <Input label="Phone Number"  type="tel"   placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        <Input label="Location"      placeholder="City, State" value={form.location} onChange={(e) => set('location', e.target.value)} />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea rows={3} placeholder="A short bio..." value={form.bio} onChange={(e) => set('bio', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] resize-none transition-all" />
        </div>
      </SectionCard>
      <SectionCard title="Academic Info" description="Your education and career stage">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Current Role / Title" value={form.jobTitle}    onChange={(e) => set('jobTitle', e.target.value)} />
          <Input label="University"            value={form.university}  onChange={(e) => set('university', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Graduation Year" value={form.graduationYear} onChange={(v) => set('graduationYear', v)} options={['2024','2025','2026','2027','2028']} />
          <Select label="Job Search Status" value="College Student" onChange={() => {}} options={['College Student','Recent Graduate','Job Seeker']} />
        </div>
      </SectionCard>
      <SectionCard title="Social Links" description="Add links to your profiles">
        <Input label="LinkedIn URL"  placeholder="https://linkedin.com/in/..." value={form.linkedin}  onChange={(e) => set('linkedin', e.target.value)} />
        <Input label="GitHub URL"    placeholder="https://github.com/..."      value={form.github}    onChange={(e) => set('github', e.target.value)} />
        <Input label="Portfolio"     placeholder="https://yourportfolio.com"   value={form.portfolio} onChange={(e) => set('portfolio', e.target.value)} />
      </SectionCard>
      <div className="flex justify-end">
        <button onClick={handleSave} className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all', saved ? 'bg-green-500 text-white' : 'bg-[#2f54c8] hover:bg-[#2645b0] text-white')}>
          {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const [theme, setTheme] = useState('system')
  const [accent, setAccent] = useState('blue')
  const [density, setDensity] = useState('comfortable')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [fontSize, setFontSize] = useState('medium')
  const themes  = [{ key:'light',label:'Light',icon:Sun },{ key:'dark',label:'Dark',icon:Moon },{ key:'system',label:'System',icon:Monitor }]
  const accents = [{ key:'blue',color:'bg-[#2f54c8]' },{ key:'violet',color:'bg-violet-500' },{ key:'teal',color:'bg-teal-500' },{ key:'rose',color:'bg-rose-500' },{ key:'amber',color:'bg-amber-500' },{ key:'green',color:'bg-green-500' }]
  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionCard title="Theme" description="Choose how AppTrack looks for you">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {themes.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTheme(key)}
              className={cn('flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all', theme===key ? 'border-[#2f54c8] bg-[#eef2ff]' : 'border-gray-200 hover:border-gray-300 bg-white')}>
              <Icon size={20} className={theme===key ? 'text-[#2f54c8]' : 'text-gray-500'} />
              <span className={cn('text-xs sm:text-sm font-medium', theme===key ? 'text-[#2f54c8]' : 'text-gray-600')}>{label}</span>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Accent Color" description="Personalize your interface color">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {accents.map(({ key, color }) => (
            <button key={key} onClick={() => setAccent(key)}
              className={cn('w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all', color, accent===key ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105')} />
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Layout & Display">
        <SettingRow label="Compact Density" description="Reduce padding for more content">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {['Comfortable','Compact'].map((d) => (
              <button key={d} onClick={() => setDensity(d.toLowerCase())}
                className={cn('px-3 py-2 text-xs sm:text-sm font-medium transition-colors', density===d.toLowerCase() ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50')}>{d}</button>
            ))}
          </div>
        </SettingRow>
        <Divider />
        <SettingRow label="Collapse Sidebar" description="Keep sidebar minimized by default">
          <Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
        </SettingRow>
        <Divider />
        <SettingRow label="Animations" description="Enable transitions and animations">
          <Toggle checked={animationsEnabled} onChange={setAnimationsEnabled} />
        </SettingRow>
        <Divider />
        <SettingRow label="Font Size">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {['S','M','L'].map((s, i) => {
              const sizes = ['small','medium','large']
              return <button key={s} onClick={() => setFontSize(sizes[i])}
                className={cn('px-3 py-2 text-xs sm:text-sm font-medium transition-colors', fontSize===sizes[i] ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50')}>{s}</button>
            })}
          </div>
        </SettingRow>
      </SectionCard>
    </div>
  )
}

function NotificationsSection() {
  const [notifs, setNotifs] = useState({ emailFollowUps:true, emailInterviews:true, emailWeeklyDigest:false, emailOffers:true, pushFollowUps:true, pushStatusChanges:true, pushReminders:false, inAppAll:true, inAppMentions:true, reminderDaysBefore:'1', quietHoursEnabled:false, quietFrom:'22:00', quietTo:'08:00' })
  const set = (k, v) => setNotifs((n) => ({ ...n, [k]: v }))
  const emailRows = [{ key:'emailFollowUps',label:'Follow-up reminders',desc:'When a follow-up is due' },{ key:'emailInterviews',label:'Interview reminders',desc:'24h before an interview' },{ key:'emailWeeklyDigest',label:'Weekly digest',desc:'Summary every Monday' },{ key:'emailOffers',label:'Offer alerts',desc:'When you receive an offer' }]
  const pushRows  = [{ key:'pushFollowUps',label:'Follow-up reminders',desc:'Push for due follow-ups' },{ key:'pushStatusChanges',label:'Status updates',desc:'When you change status' },{ key:'pushReminders',label:'Daily check-in',desc:'Morning prompt' }]
  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionCard title="Email Notifications" description="Control what gets sent to your inbox">
        {emailRows.map((r, i) => (<div key={r.key}>{i>0 && <Divider />}<SettingRow label={r.label} description={r.desc}><Toggle checked={notifs[r.key]} onChange={(v) => set(r.key, v)} /></SettingRow></div>))}
      </SectionCard>
      <SectionCard title="Push Notifications" description="Browser and mobile push alerts">
        {pushRows.map((r, i) => (<div key={r.key}>{i>0 && <Divider />}<SettingRow label={r.label} description={r.desc}><Toggle checked={notifs[r.key]} onChange={(v) => set(r.key, v)} /></SettingRow></div>))}
      </SectionCard>
      <SectionCard title="Reminder Settings">
        <SettingRow label="Remind me before follow-up" description="How many days before the due date">
          <select value={notifs.reminderDaysBefore} onChange={(e) => set('reminderDaysBefore', e.target.value)}
            className="h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20">
            {['Same day','1 day before','2 days before','3 days before'].map((o, i) => <option key={i} value={i}>{o}</option>)}
          </select>
        </SettingRow>
        <Divider />
        <SettingRow label="Quiet hours" description="Pause notifications during set hours">
          <Toggle checked={notifs.quietHoursEnabled} onChange={(v) => set('quietHoursEnabled', v)} />
        </SettingRow>
        {notifs.quietHoursEnabled && (
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="space-y-1"><label className="text-xs text-gray-400">From</label><input type="time" value={notifs.quietFrom} onChange={(e) => set('quietFrom', e.target.value)} className="h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
            <span className="text-gray-400 mt-4">→</span>
            <div className="space-y-1"><label className="text-xs text-gray-400">To</label><input type="time" value={notifs.quietTo} onChange={(e) => set('quietTo', e.target.value)} className="h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function PrivacySection() {
  const [showPwd, setShowPwd] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [profilePublic, setProfilePublic] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [pwd, setPwd] = useState({ current:'', newPwd:'', confirm:'' })
  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionCard title="Change Password">
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Current Password</label>
          <input type={showPwd ? 'text' : 'password'} value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} placeholder="Enter current password"
            className="w-full h-10 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all" />
          <button onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-8 text-gray-400 hover:text-gray-600">
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <Input label="New Password"         type="password" placeholder="Min 8 characters"   value={pwd.newPwd}  onChange={(e) => setPwd((p) => ({ ...p, newPwd: e.target.value }))} />
        <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} />
        <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">Update Password</button>
      </SectionCard>
      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security">
        <SettingRow label="Enable 2FA" description="Require a code when signing in"><Toggle checked={twoFactor} onChange={setTwoFactor} /></SettingRow>
        {twoFactor && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-sm text-amber-700">📱 Scan the QR code with your authenticator app to complete setup.</div>}
      </SectionCard>
      <SectionCard title="Privacy Controls">
        <SettingRow label="Public profile" description="Allow others to view your profile"><Toggle checked={profilePublic} onChange={setProfilePublic} /></SettingRow>
        <Divider />
        <SettingRow label="Usage analytics" description="Share anonymous usage data"><Toggle checked={analyticsEnabled} onChange={setAnalyticsEnabled} /></SettingRow>
      </SectionCard>
      <SectionCard title="Danger Zone">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-xl border border-red-100 gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-red-700">Delete Account</p>
            <p className="text-xs text-red-400 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors whitespace-nowrap">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

function IntegrationsSection() {
  const [connected, setConnected] = useState({ linkedin:false, google:true, github:false, notion:false })
  const toggle = (k) => setConnected((c) => ({ ...c, [k]: !c[k] }))
  const integrations = [
    { key:'google',   name:'Google',   desc:'Sync follow-ups to Google Calendar', icon:'🔵', color:'bg-blue-50' },
    { key:'linkedin', name:'LinkedIn', desc:'Import job listings from LinkedIn',   icon:'💼', color:'bg-sky-50'  },
    { key:'github',   name:'GitHub',   desc:'Sign in and link your GitHub profile',icon:'⚫', color:'bg-gray-50' },
    { key:'notion',   name:'Notion',   desc:'Export applications to a Notion page',icon:'⬜', color:'bg-gray-50' },
  ]
  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionCard title="Connected Services" description="Manage third-party integrations">
        <div className="space-y-3">
          {integrations.map((intg) => (
            <div key={intg.key} className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${intg.color} flex items-center justify-center text-lg sm:text-xl flex-shrink-0`}>{intg.icon}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{intg.name}</p>
                  <p className="text-xs text-gray-400 hidden sm:block">{intg.desc}</p>
                </div>
              </div>
              <button onClick={() => toggle(intg.key)}
                className={cn('px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap', connected[intg.key] ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200' : 'bg-[#2f54c8] text-white hover:bg-[#2645b0]')}>
                {connected[intg.key] ? 'Connected ✓' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function DataSection() {
  const [exporting, setExporting] = useState(false)
  return (
    <div className="space-y-4 sm:space-y-5">
      <SectionCard title="Export Your Data" description="Download a copy of all your applications">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[{ format:'CSV',desc:'Spreadsheet-ready',icon:'📊' },{ format:'JSON',desc:'Developer-friendly',icon:'🛠️' },{ format:'PDF',desc:'Print-ready report',icon:'📄' }].map(({ format, desc, icon }) => (
            <button key={format} onClick={() => { setExporting(true); setTimeout(() => setExporting(false), 1500) }}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-[#2f54c8] hover:bg-[#eef2ff] transition-all group">
              <span className="text-2xl sm:text-3xl">{icon}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#2f54c8]">{format}</span>
              <span className="text-xs text-gray-400 hidden sm:block">{desc}</span>
            </button>
          ))}
        </div>
        {exporting && <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-xl"><Check size={15} /> Export started — check your email shortly.</div>}
      </SectionCard>
      <SectionCard title="Import Data" description="Bring in applications from other tools">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:border-[#2f54c8] transition-colors cursor-pointer">
          <Download size={24} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">Drop a CSV or JSON file here</p>
          <p className="text-xs text-gray-400 mt-1">or <span className="text-[#2f54c8] font-medium hover:underline">browse files</span></p>
        </div>
      </SectionCard>
      <SectionCard title="Storage Usage">
        <div className="space-y-3">
          {[{ label:'Applications',used:84,max:'unlimited',pct:42,color:'bg-blue-500' },{ label:'Resumes',used:'4.2 MB',max:'50 MB',pct:8,color:'bg-purple-500' },{ label:'Notes',used:32,max:'unlimited',pct:15,color:'bg-teal-500' }].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{s.label}</span>
                <span className="text-gray-400 text-xs sm:text-sm">{s.used}{typeof s.max === 'string' && s.max !== 'unlimited' ? ` / ${s.max}` : ''}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${s.color} rounded-full`} style={{ width:`${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

const SECTION_MAP = { profile:ProfileSection, appearance:AppearanceSection, notifications:NotificationsSection, privacy:PrivacySection, integrations:IntegrationsSection, data:DataSection }

export default function SettingsPage() {
  const [activeTab, setActiveTab]   = useState('profile')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const ActiveSection = SECTION_MAP[activeTab]
  const activeLabel   = TABS.find((t) => t.key === activeTab)?.label

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-gray-400 mt-0.5 text-sm">Manage your account preferences</p>
        </div>

        {/* Mobile tab selector */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700"
          >
            <span>{activeLabel}</span>
            <ChevronRight size={16} className={cn('transition-transform', showMobileMenu && 'rotate-90')} />
          </button>
          {showMobileMenu && (
            <div className="mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setShowMobileMenu(false) }}
                  className={cn('w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left border-b border-gray-50 last:border-0 transition-colors', activeTab===tab.key ? 'bg-[#eef2ff] text-[#2f54c8]' : 'text-gray-600 hover:bg-gray-50')}>
                  <tab.icon size={16} strokeWidth={1.8} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-5 lg:gap-6">
          {/* Sidebar nav — hidden on mobile */}
          <div className="hidden md:block w-48 lg:w-52 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {TABS.map((tab, i) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left', i<TABS.length-1 && 'border-b border-gray-50', activeTab===tab.key ? 'bg-[#eef2ff] text-[#2f54c8]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
                  <tab.icon size={16} strokeWidth={1.8} />
                  {tab.label}
                  {activeTab===tab.key && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
              <div className="border-t border-gray-100 p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            <ActiveSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}