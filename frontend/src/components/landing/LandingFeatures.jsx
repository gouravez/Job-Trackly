import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/effects/GlobalEffects.jsx";
import { FEATURES } from "@/components/landing/landingData.js";

const AUTO_ADVANCE_MS = 4000;
// How many cards are visible at once (desktop). On mobile we show 1.
const VISIBLE = 3;

export default function LandingFeatures() {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState(null); // "left" | "right" | null
  const hoveringRef = useRef(false);
  const total = FEATURES.length;

  const goTo = (i, dir) => {
    const next = (i + total) % total;
    if (next === active) return;
    setAnimDir(dir ?? (next > active ? "right" : "left"));
    setActive(next);
  };

  const prev = () => goTo(active - 1, "left");
  const next = () => goTo(active + 1, "right");

  // Auto-advance, paused on hover
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (hoveringRef.current) return;
      setAnimDir("right");
      setActive((i) => (i + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [total]);

  // Build the ordered list of visible cards starting from `active`
  // We show VISIBLE cards; centre card = active.
  // On mobile (< md) only 1 card shown — the active one.
  const offset = Math.floor(VISIBLE / 2); // 1 for VISIBLE=3
  const indices = Array.from(
    { length: VISIBLE },
    (_, k) => (active - offset + k + total) % total,
  );

  return (
    <section
      id="features"
      className="max-w-6xl mx-auto px-6 py-24"
      onMouseEnter={() => (hoveringRef.current = true)}
      onMouseLeave={() => (hoveringRef.current = false)}
    >
      {/* Heading */}
      <Reveal variant="up" className="text-center mb-16">
        <p className="text-sm font-semibold text-brand-500 mb-3 tracking-widest uppercase">
          Everything in one place
        </p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Built for your personal job search
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          No recruiters, no noise — just the tools you need to manage your own
          applications with clarity.
        </p>
      </Reveal>

      {/* Carousel */}
      <Reveal variant="scale">
        <div className="relative flex items-center gap-4">
          {/* ← Arrow */}
          <button
            onClick={prev}
            data-cursor-hover
            aria-label="Previous feature"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm
                       flex items-center justify-center text-gray-500
                       hover:bg-gray-50 hover:text-[#2f54c8] hover:border-blue-200
                       transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          {/* Cards track */}
          <div className="flex-1 overflow-hidden">
            <div
              key={active}
              className={`grid grid-cols-1 md:grid-cols-3 gap-4
                          ${animDir === "right" ? "feat-carousel-in-right" : "feat-carousel-in-left"}`}
            >
              {indices.map((idx, position) => {
                const f = FEATURES[idx];
                const Icon = f.icon;
                const isCenter = position === offset;

                return (
                  <button
                    key={idx}
                    onClick={() => goTo(idx, idx > active ? "right" : "left")}
                    data-cursor-hover
                    className={`
                      feat-feature-card text-left rounded-2xl border p-6 transition-all duration-300
                      ${
                        isCenter
                          ? "border-blue-200 bg-white shadow-lg shadow-blue-100/50 scale-100 opacity-100"
                          : "border-gray-100 bg-gray-50/60 scale-95 opacity-60 hover:opacity-80 hover:scale-[0.97]"
                      }
                      ${position === 0 ? "hidden md:block" : ""}
                      ${position === 2 ? "hidden md:block" : ""}
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                    >
                      <Icon size={22} className={f.accent} strokeWidth={1.8} />
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-bold text-lg mb-2 ${isCenter ? "text-gray-900" : "text-gray-600"}`}
                    >
                      {f.title}
                    </h3>

                    {/* Description — full on centre card, truncated on side cards */}
                    <p
                      className={`text-sm leading-relaxed ${isCenter ? "text-gray-500" : "text-gray-400 line-clamp-3"}`}
                    >
                      {f.desc}
                    </p>

                    {/* Active indicator bar */}
                    {isCenter && (
                      <div className="mt-5 h-0.5 rounded-full bg-[#2f54c8]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* → Arrow */}
          <button
            onClick={next}
            data-cursor-hover
            aria-label="Next feature"
            className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm
                       flex items-center justify-center text-gray-500
                       hover:bg-gray-50 hover:text-[#2f54c8] hover:border-blue-200
                       transition-all duration-200 z-10"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? "right" : "left")}
              aria-label={`Go to feature ${i + 1}`}
              data-cursor-hover
              className={`rounded-full transition-all duration-300
                ${
                  i === active
                    ? "w-6 h-1.5 bg-[#2f54c8]"
                    : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
