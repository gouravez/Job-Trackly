import Logo from "@/components/ui/Logo.jsx";

export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#features"     className="hover:text-gray-800 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-800 transition-colors">How it works</a>
          <a href="#pricing"      className="hover:text-gray-800 transition-colors">Pricing</a>
          <a href="#students"     className="hover:text-gray-800 transition-colors">Students</a>
          <a href="#"             className="hover:text-gray-800 transition-colors">Privacy</a>
          <a href="#"             className="hover:text-gray-800 transition-colors">Terms</a>
          <a href="#"             className="hover:text-gray-800 transition-colors">Support</a>
        </div>
        <p className="text-sm text-gray-400">© 2026 Job Trackly</p>
      </div>
    </footer>
  );
}