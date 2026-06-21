import { Link as RouterLink } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import { Reveal } from "@/effects/GlobalEffects.jsx";
import { PRICING_PLANS } from "@/components/landing/landingData.js";

export default function LandingPricing() {
  return (
    <section id="pricing" className="max-w-5xl mx-auto px-6 py-24">
      <Reveal variant="up" className="text-center mb-16">
        <p className="text-sm font-semibold text-brand-500 mb-3 tracking-widest uppercase">
          Pricing
        </p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          One price: $0. For everyone.
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          No tiers gated behind a paywall, no trial countdown, no credit card.
          Every plan, every feature, completely free — forever.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-6 items-stretch">
        {PRICING_PLANS.map((plan, i) => (
          <Reveal
            key={plan.name}
            variant="scale"
            delay={i * 90}
            className="h-full"
          >
            <div
              className={`price-card h-full rounded-2xl p-7 flex flex-col border ${
                plan.highlight
                  ? "border-brand-500 bg-gray-900 text-white shadow-xl relative"
                  : "border-gray-100 bg-white"
              }`}
              data-cursor-hover
            >
              {plan.highlight && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  <Sparkles size={12} /> {plan.badge}
                </span>
              )}

              <h3
                className={`font-bold text-lg ${plan.highlight ? "text-white" : "text-gray-900"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-6 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}
              >
                {plan.tagline}
              </p>

              <div className="mb-6">
                <span
                  className={`text-5xl font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}
                >
                  ${plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}
                >
                  USD / forever
                </span>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2
                      size={16}
                      className={`flex-shrink-0 mt-0.5 ${plan.highlight ? "text-teal-400" : "text-teal-500"}`}
                    />
                    <span
                      className={
                        plan.highlight ? "text-gray-200" : "text-gray-700"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <RouterLink to="/signup" className="mt-auto">
                <Button
                  size="lg"
                  variant={plan.highlight ? "secondary" : "dark"}
                  className="w-full font-semibold justify-center"
                >
                  Get started free
                </Button>
              </RouterLink>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-10">
        Seriously — no hidden costs, no "free trial," no upsell later. $0 is the
        price.
      </p>
    </section>
  );
}
