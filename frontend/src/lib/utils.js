import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr  // already formatted — return as-is
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}