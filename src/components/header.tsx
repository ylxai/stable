'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Phone, AtSign } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger the split reveal animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-dynamic-secondary shadow-dynamic sticky top-0 z-50 border-b border-dynamic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Signature Style Logo */}
          <Link href="/" className="flex items-center group cursor-pointer relative">
            {/* Enhanced Logo Typography with Split Reveal Animation */}
            <div className="flex items-baseline relative gap-1 overflow-hidden">
              {/* "H" with Fleur De Leah font - slides in from left */}
              <span 
                className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gray-800 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-105 transition-all duration-700 relative z-10 ${
                  isLoaded 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform -translate-x-full opacity-0'
                }`}
                style={{
                  fontFamily: '"Fleur De Leah", cursive',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                  transitionDelay: '0ms'
                }}
              >
                H
              </span>
              
              {/* "afiportrait" with Edu TAS Beginner font - slides in from right */}
              <span 
                className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl group-hover:scale-102 transition-all duration-700 relative z-10 ${
                  isLoaded 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform translate-x-full opacity-0'
                }`}
                style={{
                  fontFamily: '"Edu TAS Beginner", cursive',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.2))',
                  textShadow: '0 0 8px rgba(74, 85, 104, 0.3)',
                  transitionDelay: '150ms'
                }}
              >
                afiportrait
              </span>
              
              {/* Subtle glow effect behind the logo - fades in after text */}
              <div 
                className={`absolute inset-0 group-hover:opacity-40 transition-all duration-500 blur-sm ${
                  isLoaded ? 'opacity-20' : 'opacity-0'
                }`}
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                  transform: 'scale(1.2)',
                  transitionDelay: '300ms'
                }}
              ></div>
            </div>
            
            {/* Subtle Underline */}
            <div className="absolute bottom-0 left-8 sm:left-9 w-0 h-0.5 bg-dynamic-accent group-hover:w-24 sm:group-hover:w-28 lg:group-hover:w-32 transition-all duration-500 ease-out"></div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium">
              Beranda
            </Link>
            <Link href="/#gallery" className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium">
              Galeri
            </Link>
            <Link href="/#pricing" className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium">
              Harga
            </Link>
            <Link href="/#contact" className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium">
              Kontak
            </Link>
            <Link href="/admin" className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium">
              Admin
            </Link>
          </nav>

          {/* Desktop CTA Area */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              asChild
              className="btn-dynamic-primary mobile-button"
            >
              <Link href="/#contact">
                Hubungi Kami
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dynamic py-4 space-y-2 bg-dynamic-secondary">
            <Link 
              href="/" 
              className="block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-colors touch-target font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/#gallery" 
              className="block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-colors touch-target font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              href="/#pricing" 
              className="block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-colors touch-target font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Harga
            </Link>
            <Link 
              href="/#contact" 
              className="block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-colors touch-target font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link 
              href="/admin" 
              className="block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-colors touch-target font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="px-4 pt-2">
              <Button 
                asChild
                className="btn-dynamic-primary w-full"
              >
                <Link href="/#contact">
                  Hubungi Kami
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
