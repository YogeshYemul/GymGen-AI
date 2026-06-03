import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <HeroSection />

      <MarqueeSection />

      <FeaturesSection />

      <HowItWorksSection />

      <TestimonialsSection />

      <PricingSection />

      <CTASection />

      <Footer />
    </main>
  );
}