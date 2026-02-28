"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { WhyChooseUsSection } from "../components/landing/WhyChooseUsSection";
import { CtaSection } from "../components/landing/CtaSection";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch with animated framer-motion components
  }

  return (
    <main className="min-h-screen bg-[#0a0f1c] selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
