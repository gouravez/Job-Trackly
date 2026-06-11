import { useState, useEffect } from 'react'
import { Loader2, Send } from 'lucide-react'
import { reminderService } from '@/services/api'
import { SettingsCard, SaveButton, ToggleRow } from './SettingsPrimitives'
import { cn } from '@/lib/utils'

const TEST_LABEL = {
  null:    'Send Test Email',
  sending: 'Sending…',
  sent:    'Test email sent!',
  empty:   'No applications to preview',
  error:   'Failed — check SMTP config',
}

const TEST_STYLE = {
  null:    'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300',
  sending: 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed',
  sent:    'border-green-300 text-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-emerald-400',
  empty:   'border-yellow-300 text-yellow-600 bg-yellow-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
  error:   'border-red-300 text-red-600 bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
}

export default function NotificationsSection() {
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [settings,   setSettings]   = useState({
    reminderEnabled:   false,
    reminderDays:      7,
    reminderFrequency: 'weekly',
  })

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }))

  useEffect(() => {
    reminderService.getSettings()
      .then(({ data }) => setSettings(data.data))
      .catch(() => setFetchError('Could not load reminder settings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await reminderService.saveSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save reminder settings:', err)
    } finally { setSaving(false) }
  }

  const handleTest = async () => {
    setTestStatus('sending')
    try {
      const { data } = await reminderService.sendTest()
      setTestStatus(data.success ? 'sent' : 'empty')
    } catch {
      setTestStatus('error')
    } finally {
      setTimeout(() => setTestStatus(null), 4000)
    }
  }

  if (loading) return (
    <div className="space-y-5">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-36 animate-pulse" />
      ))}
    </div>
  )

  if (fetchError) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6 text-sm text-red-600 dark:text-red-400">
      {fetchError}
    </div>
  )

  return (
    <div className="space-y-5">
      <SettingsCard title="Follow-up Reminders" description="Get emailed when applications haven't moved in a while">
        <ToggleRow
          label="Enable email reminders"
          description="We'll send you a nudge when applications have been sitting in Applied or Assessment."
          checked={settings.reminderEnabled}
          onChange={(v) => set('reminderEnabled', v)}
        />
      </SettingsCard>

      {settings.reminderEnabled && (
        <SettingsCard title="Reminder Preferences" description="Customise when and how often you hear from us">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Remind me after</label>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={30} value={settings.reminderDays}
                onChange={(e) => set('reminderDays', Number(e.target.value))}
                className="flex-1 accent-[#2f54c8]" />
              <span className="text-sm font-semibold text-[#2f54c8] w-20 text-right">
                {settings.reminderDays} day{settings.reminderDays !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Applications that haven't been updated in this many days will trigger a reminder.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Email frequency</label>
            <div className="flex gap-3">
              {['daily', 'weekly'].map((freq) => (
                <button key={freq} onClick={() => set('reminderFrequency', freq)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all',
                    settings.reminderFrequency === freq
                      ? 'border-[#2f54c8] bg-[#eef2ff] dark:bg-[#0f1a35] text-[#2f54c8]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  )}>
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Want to see what the email looks like? Send yourself a live preview.
            </p>
            <button onClick={handleTest} disabled={testStatus === 'sending'}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                TEST_STYLE[testStatus] ?? TEST_STYLE.null)}>
              {testStatus === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {TEST_LABEL[testStatus] ?? TEST_LABEL.null}
            </button>
          </div>

          <SaveButton saved={saved} loading={saving} onClick={handleSave} />
        </SettingsCard>
      )}

      {!settings.reminderEnabled && (
        <SaveButton saved={saved} loading={saving} onClick={handleSave} />
      )}
    </div>
  )
}