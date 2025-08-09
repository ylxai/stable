'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Phone, AtSign } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dynamic-secondary shadow-dynamic sticky top-0 z-50 border-b border-dynamic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Signature Style Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer relative">
            {/* Simple Camera Icon */}
            <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-dynamic-accent group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            
            {/* Signature Typography */}
            <span 
              className="text-xl sm:text-2xl lg:text-3xl text-dynamic-accent group-hover:text-dynamic-accent/80 transition-all duration-300"
              style={{
                fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              Hafiportrait
            </span>
            
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
          </nav>

          {/* Desktop Admin Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              asChild
              className="btn-dynamic-primary mobile-button"
            >
              <Link href="/admin">
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              asChild
              size="sm"
              className="btn-dynamic-primary text-xs px-3"
            >
              <Link href="/admin">
                Admin
              </Link>
            </Button>
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
          </div>
        )}
      </div>
    </header>
  );
}
