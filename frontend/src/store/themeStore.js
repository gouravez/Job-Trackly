import { create } from 'zustand'

// ---------------------------------------------------------------------------
// Theme Store — persists to localStorage, applies dark class to <html>.
// Consumed by: SettingsPage (AppearanceSection), ThemeProvider
// ---------------------------------------------------------------------------

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
}

const saved = localStorage.getItem('theme') || 'system'
applyTheme(saved)

const useThemeStore = create((set) => ({
  theme: saved,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    set({ theme })
  },
}))

// Listen for system preference changes when theme === 'system'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const current = localStorage.getItem('theme') || 'system'
  if (current === 'system') {
    document.documentElement.classList.toggle('dark', e.matches)
  }
})

export default useThemeStore