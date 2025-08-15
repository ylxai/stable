'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoHeader } from "@/components/ui/logo";
import { Camera, Menu, X, Phone, AtSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    // Handle scroll effect for mobile
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when breakpoint changes
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className={`bg-dynamic-secondary shadow-dynamic sticky top-0 z-50 border-b border-dynamic mobile-header-scroll transition-all duration-300 ${
      isScrolled ? 'mobile-backdrop' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isMobile ? (isScrolled ? 'h-14' : 'h-16') : 'h-16'
        }`}>
          {/* Enhanced Mobile-First Logo */}
          <Link href="/" className="mobile-optimized flex-shrink-0">
            <LogoHeader />
          </Link>
          
          {/* Desktop Navigation - Enhanced */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium relative group"
            >
              Beranda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dynamic-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/#gallery" 
              className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium relative group"
            >
              Galeri
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dynamic-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/#pricing" 
              className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium relative group"
            >
              Harga
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dynamic-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/#contact" 
              className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium relative group"
            >
              Kontak
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dynamic-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/admin" 
              className="text-dynamic-secondary hover:text-dynamic-accent transition-colors font-medium relative group"
            >
              Admin
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dynamic-accent group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Quick Contact Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <a 
              href="tel:+6281234567890" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dynamic-accent/10 text-dynamic-accent hover:bg-dynamic-accent hover:text-white transition-all duration-300 group"
              aria-label="Telepon kami"
            >
              <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="mailto:info@hafiportrait.com" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-dynamic-accent/10 text-dynamic-accent hover:bg-dynamic-accent hover:text-white transition-all duration-300 group"
              aria-label="Email kami"
            >
              <AtSign className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://wa.me/6281234567890" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 group"
              aria-label="WhatsApp kami"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`touch-target mobile-menu-button transition-all duration-200 ${
                isMobileMenuOpen ? 'bg-dynamic-accent/10 text-dynamic-accent' : 'text-dynamic-secondary hover:text-dynamic-accent'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dynamic py-4 space-y-2 mobile-backdrop mobile-menu-container">
            {/* Main Navigation Links */}
            <div className="space-y-1">
              <Link 
                href="/" 
                className="mobile-menu-item block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-all duration-200 touch-target font-medium text-base rounded-lg mx-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">🏠</span>
                Beranda
              </Link>
              <Link 
                href="/#gallery" 
                className="mobile-menu-item block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-all duration-200 touch-target font-medium text-base rounded-lg mx-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">📸</span>
                Galeri
              </Link>
              <Link 
                href="/#pricing" 
                className="mobile-menu-item block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-all duration-200 touch-target font-medium text-base rounded-lg mx-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">💰</span>
                Harga
              </Link>
              <Link 
                href="/#contact" 
                className="mobile-menu-item block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-all duration-200 touch-target font-medium text-base rounded-lg mx-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">📞</span>
                Kontak
              </Link>
              <Link 
                href="/admin" 
                className="mobile-menu-item block px-4 py-3 text-dynamic-secondary hover:text-dynamic-accent hover:bg-dynamic-accent/10 transition-all duration-200 touch-target font-medium text-base rounded-lg mx-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3 text-lg">⚙️</span>
                Admin
              </Link>
            </div>
            
            {/* Quick Contact Section */}
            <div className="border-t border-dynamic-accent/20 pt-4 mt-4">
              <div className="px-4 pb-2">
                <h3 className="text-sm font-semibold text-dynamic-accent mb-3">Hubungi Kami</h3>
              </div>
              
              {/* Quick Contact Icons for Mobile */}
              <div className="flex justify-center space-x-4 px-4">
                <a 
                  href="tel:+6281234567890" 
                  className="quick-contact-icon flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-dynamic-accent/10 text-dynamic-accent hover:bg-dynamic-accent hover:text-white transition-all duration-300 group"
                  aria-label="Telepon kami"
                >
                  <Phone className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Telepon</span>
                </a>
                <a 
                  href="mailto:info@hafiportrait.com" 
                  className="quick-contact-icon flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-dynamic-accent/10 text-dynamic-accent hover:bg-dynamic-accent hover:text-white transition-all duration-300 group"
                  aria-label="Email kami"
                >
                  <AtSign className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Email</span>
                </a>
                <a 
                  href="https://wa.me/6281234567890" 
                  className="quick-contact-icon flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 group"
                  aria-label="WhatsApp kami"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="text-xs font-medium">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
