'use client';

import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import EventsSection from "@/components/events-section";
import GallerySection from "@/components/gallery-section";
import PricingSection from "@/components/pricing-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { ColorPaletteProvider } from "@/components/ui/color-palette-provider";
import { ColorPaletteSwitcher } from "@/components/ui/color-palette-switcher";

export default function HomePage() {
  return (
    <ColorPaletteProvider>
      <div className="min-h-screen bg-dynamic-primary">
        {/* Floating Color Palette Switcher */}
        <ColorPaletteSwitcher variant="floating" />
        
        <Header />
        <main className="relative">
          <HeroSection />
          <EventsSection />
          <GallerySection />  
          <PricingSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ColorPaletteProvider>
  );
} 