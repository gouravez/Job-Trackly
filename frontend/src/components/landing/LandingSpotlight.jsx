import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/landing/LandingEffects.jsx";
import { CalendarMockup, AnalyticsMockup, DashboardMockup } from "@/components/landing/LandingMockups.jsx";

function SpotlightRow({ reveal, mockupReveal, eyebrow, eyebrowColor, title, desc, items, dotColor, mockup, reverse }) {
  const textOrder = reverse ? "order-1 md:order-2" : "order-1";
  const mockOrder = reverse ? "order-2 md:order-1" : "order-2";
  return (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <Reveal variant={reveal} className={textOrder}>
        <p className={`text-sm font-semibold ${eyebrowColor} mb-3 tracking-widest uppercase`}>{eyebrow}</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
              <CheckCircle2 size={16} className={`${dotColor} flex-shrink-0`} /> {item}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal variant={mockupReveal} className={`flex justify-center ${mockOrder}`}>
        {mockup}
      </Reveal>
    </div>
  );
}

export default function LandingSpotlight() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 space-y-24">
      <SpotlightRow
        reveal="left"
        mockupReveal="rotateRight"
        eyebrow="Calendar"
        eyebrowColor="text-teal-600"
        title={<>Interviews &amp; follow-ups,<br />always in view</>}
        desc="Every application event shows on a monthly calendar. Connect Google Calendar to sync interviews two-way and get reminders before anything slips."
        items={["Monthly calendar with color-coded events", "Google Calendar two-way sync", "Follow-up deadline tracking", "Upcoming events sidebar"]}
        dotColor="text-teal-500"
        mockup={<CalendarMockup />}
      />

      <SpotlightRow
        reveal="right"
        mockupReveal="rotateLeft"
        eyebrow="Analytics"
        eyebrowColor="text-purple-600"
        title={<>See exactly where<br />your search stands</>}
        desc="Monthly trends, application funnel, status breakdown, and top companies — visualize your progress and double down on what's working."
        items={["Monthly application trends chart", "Status breakdown & funnel view", "Top companies by activity", "Response rate tracking"]}
        dotColor="text-purple-500"
        mockup={<AnalyticsMockup />}
        reverse
      />

      <SpotlightRow
        reveal="left"
        mockupReveal="rotateRight"
        eyebrow="Dashboard"
        eyebrowColor="text-[#2f54c8]"
        title={<>Your search,<br />summarized</>}
        desc="Log in and see your whole search at once: how many applications are moving, what's trending, and what needs a follow-up today."
        items={["Stat cards for applied, interviews, offers, and rejected", "30-day application activity trend", "Recent applications at a glance", "Follow-ups due, surfaced automatically"]}
        dotColor="text-[#2f54c8]"
        mockup={<DashboardMockup />}
      />
    </section>
  );
}