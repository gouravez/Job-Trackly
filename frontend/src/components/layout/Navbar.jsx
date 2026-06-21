import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo.jsx'
import Button from '@/components/ui/Button.jsx'

const NAV_LINKS = [
  { label: 'Features',     href: '#features'     },
  { label: 'How it works', href: '#how-it-works'  },
  { label: 'Pricing',      href: '#pricing'       },
  { label: 'Students',     href: '#students'      },
]

function scrollToSection(e, href) {
  e.preventDefault()
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (!el) return

  const smoothContent = document.querySelector('.smooth-content')
  if (smoothContent) {
    let top = 0
    let node = el
    while (node && node !== smoothContent) {
      top += node.offsetTop
      node = node.offsetParent
    }
    window.scrollTo({ top: Math.max(0, top - 64) })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/signin">
            <Button variant="ghost" size="md" className="font-medium text-gray-700">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="md" className="font-medium">
              Get started free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}