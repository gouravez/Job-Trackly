import Navbar from "@/components/layout/Navbar.jsx";
import { SmoothScroll } from "@/effects/GlobalEffects.jsx";
import LandingHero from "@/components/landing/LandingHero.jsx";
import LandingFeatures from "@/components/landing/LandingFeatures.jsx";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks.jsx";
import LandingSpotlight from "@/components/landing/LandingSpotlight.jsx";
import LandingStudents from "@/components/landing/LandingStudents.jsx";
import LandingPricing from "@/components/landing/LandingPricing.jsx";
import LandingCTA from "@/components/landing/LandingCTA.jsx";
import LandingFooter from "@/components/landing/LandingFooter.jsx";
import {
  BackToTop,
  ScrollDownHint,
} from "@/components/landing/LandingScrollUI.jsx";

export default function LandingPage() {
  return (
    // "landing-light-surface" tells the global cursor CSS to ignore the
    // dark-mode color flip here — this page is always white, regardless
    // of the user's saved app theme.
    <div className="landing-light-surface min-h-screen bg-white font-sans">
      <Navbar />

      <SmoothScroll>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingSpotlight />
        <LandingStudents />
        <LandingPricing />
        <LandingCTA />
        <LandingFooter />
      </SmoothScroll>

      <BackToTop />
      <ScrollDownHint />
    </div>
  );
}
