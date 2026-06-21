import { Link as RouterLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import { Reveal } from "@/effects/GlobalEffects.jsx";

export default function LandingCTA() {
  return (
    <section className="px-6 py-24">
      <Reveal variant="scale" className="max-w-4xl mx-auto bg-gray-900 rounded-3xl px-10 py-16 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Take control of your job search today
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          Free forever for students. Sign up with email or Google in under a minute — no credit card required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <RouterLink to="/signup">
            <Button variant="outline" size="lg" className="font-semibold border-white text-white hover:bg-white hover:text-gray-900 gap-2">
              Get started free <ArrowRight size={16} />
            </Button>
          </RouterLink>
          <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Talk to us
          </button>
        </div>
      </Reveal>
    </section>
  );
}