// frontend/src/components/settings/AppearanceSection.jsx
import { Sun, Moon, Monitor } from 'lucide-react'
import useThemeStore from '@/store/themeStore'
import { SettingsCard } from './SettingsPrimitives'
import { cn } from '@/lib/utils'

const THEMES = [
  { key: 'light',  label: 'Light',  icon: Sun     },
  { key: 'dark',   label: 'Dark',   icon: Moon    },
  { key: 'system', label: 'System', icon: Monitor },
]

export default function AppearanceSection() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-5">
      <SettingsCard title="Theme" description="Choose how Job Trackly looks for you">
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
              <span className={cn(
                'text-sm font-medium',
                theme === key ? 'text-[#2f54c8]' : 'text-gray-500 dark:text-gray-400'
              )}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  )
}