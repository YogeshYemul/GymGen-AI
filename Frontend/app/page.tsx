import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <HeroSection />

      <FeaturesSection />

      <HowItWorksSection />

      <PricingSection />

      <CTASection />

      <Footer />
    </main>
  );
}