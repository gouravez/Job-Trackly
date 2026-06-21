import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Smoothly scrolls the page to the element whose id matches the current
 * URL hash (e.g. /analytics#monthly-trends -> #monthly-trends).
 *
 * Sections that want to be deep-linkable should add a matching `id` and
 * the `scroll-mt-20` (or similar) utility class so they aren't hidden
 * behind the fixed global search bar.
 */
export default function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const id = decodeURIComponent(location.hash.slice(1))

    // Give the page a moment to render/finish data fetches before scrolling
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' })
        el.classList.add('search-highlight')
        setTimeout(() => el.classList.remove('search-highlight'), 1500)
      }
    }, 120)

    return () => clearTimeout(t)
  }, [location.pathname, location.hash, location.key])
}