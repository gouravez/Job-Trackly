import { useEffect, useRef } from "react";
import { STATS } from "@/components/landing/Landingdata.js";

// ─── StatsSection — observer triggers children directly ───────────────────────
export default function LandingStats() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.querySelectorAll("[data-stat-pop]").forEach((el, i) => {
            setTimeout(() => el.setAttribute("data-visible", "true"), i * 90);
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div
        ref={ref}
        className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            data-stat-pop
            style={{ opacity: 0 }}
            className="text-center"
          >
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {s.value}
            </div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
