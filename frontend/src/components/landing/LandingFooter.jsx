import { Github, Linkedin, Heart } from "lucide-react";
import Logo from "@/components/ui/Logo.jsx";

// lucide-react's "X" icon is a generic close glyph, not the X/Twitter brand
// mark — so the real logo is drawn here as a small inline SVG instead.
function XLogo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com/gouravez",            icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gouravez",    icon: Linkedin },
  { label: "X",        href: "https://x.com/gouravez",                 icon: XLogo },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Top row — logo, nav links, social icons */}
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
          <Logo size="sm" />

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
            <a href="#features"     className="hover:text-gray-800 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-800 transition-colors">How it works</a>
            <a href="#pricing"      className="hover:text-gray-800 transition-colors">Pricing</a>
            <a href="#students"     className="hover:text-gray-800 transition-colors">Students</a>
            <a href="#"             className="hover:text-gray-800 transition-colors">Privacy</a>
            <a href="#"             className="hover:text-gray-800 transition-colors">Terms</a>
            <a href="#"             className="hover:text-gray-800 transition-colors">Support</a>
          </nav>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor-hover
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500
                           hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row — credit + copyright */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-gray-400 inline-flex items-center gap-1.5">
            Made with
            <Heart size={13} className="text-red-500 fill-red-500" />
            by{" "}
            <a
              href="https://github.com/gouravez"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              gouravez
            </a>
          </p>
          <p className="text-sm text-gray-400">© 2026 Job Trackly</p>
        </div>
      </div>
    </footer>
  );
}