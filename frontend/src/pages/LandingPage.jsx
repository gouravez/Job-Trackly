import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Bell,
  FileText,
  Zap,
  ShieldCheck,
  ArrowRight,
  Play,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar.jsx";
import Button from "@/components/ui/Button.jsx";
import Logo from "@/components/ui/Logo.jsx";

// ─── Stats ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: "2,400+", label: "Active students" },
  { value: "84k", label: "Applications tracked" },
  { value: "96%", label: "Stay on schedule" },
  { value: "4.9", label: "Average rating" },
];

// ─── Features ────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Kanban board",
    desc: "Drag applications across stages — Applied, Interviewing, Offer — and see your pipeline at a glance.",
  },
  {
    icon: BarChart2,
    title: "Progress analytics",
    desc: "Visualize trends over time, response rates, and where you're getting the most traction.",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    desc: "Never miss a follow-up or interview deadline with timely, personalized nudges.",
  },
  {
    icon: FileText,
    title: "Resume vault",
    desc: "Store tailored resume versions and attach the right one to each application.",
  },
  {
    icon: Zap,
    title: "Quick capture",
    desc: "Log a new application in seconds with company, role, and status fields ready to go.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    desc: "Your data is yours alone. Only you ever see your applications and notes.",
  },
];

// ─── Avatar Stack ─────────────────────────────────────────────────────────────
function AvatarRow() {
  const colors = ["bg-amber-400", "bg-sky-400", "bg-rose-400"];
  const initials = ["J", "M", "A"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {colors.map((c, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
          >
            {initials[i]}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Join <span className="font-bold text-gray-900">2,400+ students</span>{" "}
        staying organized
      </p>
    </div>
  );
}

// ─── Browser Mockup ───────────────────────────────────────────────────────────
function BrowserMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="flex-1 ml-3">
          <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 inline-block">
            app.Job Trackly.io/dashboard
          </div>
        </div>
      </div>
      {/* Dashboard preview — simplified kanban */}
      <div className="p-5 bg-gray-50 min-h-[280px]">
        <div className="flex gap-3 overflow-x-auto">
          {[
            {
              col: "Applied",
              color: "bg-blue-100 text-blue-700",
              count: 12,
              cards: ["Google SWE", "Meta PM", "Stripe DS"],
            },
            {
              col: "Interviewing",
              color: "bg-amber-100 text-amber-700",
              count: 4,
              cards: ["Airbnb Design", "Notion PM"],
            },
            {
              col: "Offer",
              color: "bg-green-100 text-green-700",
              count: 1,
              cards: ["Linear Eng"],
            },
            {
              col: "Rejected",
              color: "bg-gray-100 text-gray-500",
              count: 3,
              cards: ["Twitter", "Netflix"],
            },
          ].map((col) => (
            <div key={col.col} className="flex-shrink-0 w-44">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.color}`}
                >
                  {col.col}
                </span>
                <span className="text-xs text-gray-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((card) => (
                  <div
                    key={card}
                    className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100"
                  >
                    <div className="text-xs font-medium text-gray-800">
                      {card}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Updated 2d ago
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8 shadow-sm">
          <span className="text-base">✦</span>
          Free forever for students
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
          Stay on top of every job
          <br />
          application you send.
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Job Trackly is your personal workspace to organize applications,
          visualize progress, and never miss a follow-up or deadline again.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link to="/signup">
            <Button size="xl" className="font-semibold gap-2">
              Start tracking free
              <ArrowRight size={18} />
            </Button>
          </Link>
          <button className="inline-flex items-center gap-2.5 text-gray-700 font-medium text-base hover:text-gray-900 transition-colors">
            <span className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <Play size={14} fill="currentColor" />
            </span>
            Watch demo
          </button>
        </div>

        <AvatarRow />

        {/* Browser mockup */}
        <div className="mt-14">
          <BrowserMockup />
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-dark-accent mb-3 tracking-widest uppercase">
            Everything in one place
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Built for your personal job search
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            No recruiters, no noise — just the tools you need to manage your own
            applications with clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon size={20} className="text-gray-700" strokeWidth={1.8} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl px-10 py-16 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Take control of your job search today
          </h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Free forever for students. No credit card required. Set up your
            workspace in under a minute.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                variant="outline"
                size="lg"
                className="font-semibold border-white text-white hover:bg-white hover:text-gray-900 gap-2"
              >
                Get started free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Talk to us
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-800 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Support
            </a>
          </div>
          <p className="text-sm text-gray-400">© 2025 Job Trackly</p>
        </div>
      </footer>
    </div>
  );
}
