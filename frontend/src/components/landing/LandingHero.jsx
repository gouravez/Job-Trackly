import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import { Reveal, Parallax } from "@/components/landing/LandingEffects.jsx";
import { KanbanMockup } from "@/components/landing/LandingMockups.jsx";

export default function LandingHero() {
  return (
    <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center overflow-hidden">
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8 shadow-sm">
          <span className="text-base">✦</span>
          Free forever, Yes Only for you
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
          Every application.<br />
          <span className="text-brand-500">One clean workspace.</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          A dashboard, Kanban pipeline, analytics, calendar, follow-up reminders, resume vault,
          and referral contacts — everything your job search needs in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <RouterLink to="/signup">
            <Button size="xl" className="font-semibold gap-2">
              Start tracking free <ArrowRight size={18} />
            </Button>
          </RouterLink>
          <button className="inline-flex items-center gap-2.5 text-gray-700 font-medium text-base hover:text-gray-900 transition-colors">
            <span className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <Play size={14} fill="currentColor" />
            </span>
            Watch demo
          </button>
        </div>

        {/* Kanban mockup fades up as you scroll past the fold */}
        <Reveal variant="up" delay={0} className="mt-14">
          <KanbanMockup />
        </Reveal>
      </div>
    </section>
  );
}