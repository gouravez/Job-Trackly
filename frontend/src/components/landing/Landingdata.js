import {
  LayoutDashboard, BarChart2, Bell, FileText,
  Users, CalendarDays, Columns3, Search, Moon,
} from "lucide-react";

export const KANBAN_COLS = [
  { label: "Saved",      dot: "bg-gray-400",   count: 5  },
  { label: "Applied",    dot: "bg-blue-500",   count: 12 },
  { label: "Assessment", dot: "bg-purple-500", count: 3  },
  { label: "Interview",  dot: "bg-teal-500",   count: 4  },
  { label: "Offer",      dot: "bg-green-500",  count: 1  },
  { label: "Rejected",   dot: "bg-red-500",    count: 3  },
];

export const KANBAN_CARDS = {
  Applied:   [{ role: "Frontend Engineer", company: "Stripe" }, { role: "Product Designer", company: "Linear" }],
  Interview: [{ role: "SWE — Backend",     company: "Google" }],
  Offer:     [{ role: "PM, Growth",        company: "Notion" }],
};

export const FEATURES = [
  { icon: LayoutDashboard, title: "Dashboard at a glance",         desc: "Stat cards, a 30-day activity chart, your most recent applications, and follow-ups that are due — all the moment you log in.", accent: "text-[#2f54c8]", bg: "bg-blue-50" },
  { icon: Columns3,        title: "6-stage Kanban board",          desc: "Drag applications through Saved → Applied → Assessment → Interview → Offer → Rejected. Your full pipeline, at a glance.",      accent: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: Search,          title: "Searchable applications table", desc: "Search by company or role, filter by status, and page through every application you've ever logged.",                       accent: "text-cyan-600",   bg: "bg-cyan-50"   },
  { icon: BarChart2,       title: "Analytics & funnel",            desc: "Monthly trends, status breakdown, application funnel, and top companies — see exactly where you're winning.",                accent: "text-purple-600", bg: "bg-purple-50" },
  { icon: CalendarDays,    title: "Calendar + Google sync",        desc: "Visualize interviews, follow-ups, and deadlines on a calendar view. Connect Google Calendar for two-way sync.",               accent: "text-teal-600",   bg: "bg-teal-50"   },
  { icon: Bell,            title: "Follow-up reminders",           desc: "Automated daily or weekly nudge emails so a stale application never slips through the cracks.",                               accent: "text-amber-600",  bg: "bg-amber-50"  },
  { icon: FileText,        title: "Resume vault",                  desc: "Securely store every resume version and attach the right one to the right application.",                                      accent: "text-rose-600",   bg: "bg-rose-50"   },
  { icon: Users,           title: "Referral network",              desc: "Track colleagues, alumni, recruiters, and mentors by relationship and strength, then link them to the roles they helped with.", accent: "text-green-600",  bg: "bg-green-50"  },
  { icon: Moon,            title: "Make it yours",                 desc: "Light, dark, or system theme, your profile details, and reminder cadence — all in one Settings page.",                        accent: "text-slate-600",  bg: "bg-slate-100" },
];

export const HOW_IT_WORKS = [
  { step: "01", title: "Sign up in seconds",           desc: "Create an account with email (OTP-verified) or one-click Google sign-in — no credit card, no setup." },
  { step: "02", title: "Add an application",          desc: "Log a role in seconds: company, position, status, date applied. Or save it first and apply later." },
  { step: "03", title: "Move it through the pipeline",desc: "Drag cards across your Kanban as things progress. Assessment, interview, offer — it all stays organized." },
  { step: "04", title: "Never miss a beat",           desc: "Calendar keeps your interview dates in view. Reminders ping you before follow-ups are due. Analytics show what's working." },
];

export const STUDENT_CARDS = [
  { emoji: "🎓", title: "Campus recruiting ready", desc: "Track early deadlines, rolling admissions, and multiple recruiting cycles at once." },
  { emoji: "🤝", title: "Referral network",        desc: "Track alumni, professors, and recruiters. Link them to applications to remember who helped." },
  { emoji: "📄", title: "Resume versions",         desc: "Tailor your resume per role and keep every version organized in one place." },
];

export const PRICING_PLANS = [
  {
    name: "Student",
    tagline: "Built for campus recruiting",
    price: "0",
    highlight: false,
    features: [
      "Unlimited applications",
      "6-stage Kanban board",
      "Calendar + reminders",
      "Resume vault",
    ],
  },
  {
    name: "Job Seeker",
    tagline: "Everything, for everyone",
    price: "0",
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Student",
      "Full analytics & funnel",
      "Google Calendar 2-way sync",
      "Referral network tracking",
      "Priority email support",
    ],
  },
  {
    name: "Power User",
    tagline: "For the heavy trackers",
    price: "0",
    highlight: false,
    features: [
      "Everything in Job Seeker",
      "Unlimited resume versions",
      "Custom reminder cadence",
      "Early access to new features",
    ],
  },
];