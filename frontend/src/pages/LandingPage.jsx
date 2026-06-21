import Navbar from "@/components/layout/Navbar.jsx";
import {
  GLOBAL_CSS, ScrollProgressBar, CustomCursor, SmoothScroll,
} from "@/components/landing/LandingEffects.jsx";
import LandingHero from "@/components/landing/LandingHero.jsx";
import LandingFeatures from "@/components/landing/LandingFeatures.jsx";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks.jsx";
import LandingSpotlight from "@/components/landing/LandingSpotlight.jsx";
import LandingStudents from "@/components/landing/LandingStudents.jsx";
import LandingPricing from "@/components/landing/LandingPricing.jsx";
import LandingCTA from "@/components/landing/LandingCTA.jsx";
import LandingFooter from "@/components/landing/LandingFooter.jsx";
import { BackToTop, ScrollDownHint } from "@/components/landing/LandingScrollUI.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <ScrollProgressBar />
      <CustomCursor />

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