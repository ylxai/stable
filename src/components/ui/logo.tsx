'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  showUnderline?: boolean;
}

export default function Logo({ 
  size = 'md', 
  animated = true, 
  className = '', 
  showUnderline = true 
}: LogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [animated]);

  // Size configurations
  const sizeConfig = {
    sm: {
      h: 'text-lg sm:text-xl md:text-2xl',
      afiportrait: 'text-base sm:text-lg md:text-xl',
      underlineWidth: 'w-12 sm:w-14 md:w-16',
      underlineLeft: 'left-3 sm:left-4'
    },
    md: {
      h: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
      afiportrait: 'text-lg sm:text-2xl md:text-3xl lg:text-4xl',
      underlineWidth: 'w-16 sm:w-20 md:w-24 lg:w-28',
      underlineLeft: 'left-4 sm:left-6 md:left-8'
    },
    lg: {
      h: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
      afiportrait: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
      underlineWidth: 'w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36',
      underlineLeft: 'left-5 sm:left-7 md:left-9 lg:left-11'
    },
    xl: {
      h: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
      afiportrait: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
      underlineWidth: 'w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40',
      underlineLeft: 'left-6 sm:left-8 md:left-10 lg:left-12'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center group cursor-pointer relative ${className}`}>
      {/* Logo Container with Mobile Optimization */}
      <div className="flex items-baseline relative gap-1 sm:gap-2 overflow-hidden mobile-logo-container">
        {/* "H" with Enhanced Typography */}
        <span 
          className={`${config.h} text-gray-800 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-105 transition-all duration-700 relative z-10 mobile-logo-glow mobile-logo-h ${
            animated && isLoaded 
              ? 'transform translate-x-0 opacity-100' 
              : animated 
                ? 'transform -translate-x-full opacity-0'
                : 'opacity-100'
          }`}
          style={{
            fontFamily: '"Fleur De Leah", cursive',
            fontWeight: 'bold',
            letterSpacing: isMobile ? '1px' : '2px',
            textTransform: 'uppercase',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            textShadow: '0 0 1px rgba(0,0,0,0.5)',
            transitionDelay: animated ? '0ms' : '0ms'
          }}
        >
          H
        </span>
        
        {/* "afiportrait" with Enhanced Typography */}
        <span 
          className={`${config.afiportrait} group-hover:scale-102 transition-all duration-700 relative z-10 mobile-logo-text ${
            animated && isLoaded 
              ? 'transform translate-x-0 opacity-100' 
              : animated 
                ? 'transform translate-x-full opacity-0'
                : 'opacity-100'
          }`}
          style={{
            fontFamily: '"Edu TAS Beginner", cursive',
            fontWeight: '600',
            letterSpacing: isMobile ? '0.5px' : '1px',
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #0f1419 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))',
            textShadow: '0 0 2px rgba(0,0,0,0.8), 0 0 8px rgba(74, 85, 104, 0.4)',
            transitionDelay: animated ? '150ms' : '0ms'
          }}
        >
          afiportrait
        </span>
        
        {/* Enhanced Glow Effect */}
        <div 
          className={`absolute inset-0 group-hover:opacity-40 transition-all duration-500 blur-sm ${
            isLoaded ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
            transform: 'scale(1.2)',
            transitionDelay: animated ? '300ms' : '0ms'
          }}
        />
      </div>
      
      {/* Responsive Underline */}
      {showUnderline && (
        <div className={`absolute bottom-0 ${config.underlineLeft} w-0 h-0.5 bg-dynamic-accent group-hover:${config.underlineWidth} transition-all duration-500 ease-out`} />
      )}
    </div>
  );
}

// Preset logo components for common use cases
export function LogoHeader() {
  return <Logo size="md" animated={true} showUnderline={true} />;
}

export function LogoFooter() {
  return <Logo size="sm" animated={false} showUnderline={false} className="opacity-80" />;
}

export function LogoHero() {
  return <Logo size="xl" animated={true} showUnderline={true} className="mb-4" />;
}

export function LogoMobile() {
  return <Logo size="sm" animated={true} showUnderline={true} className="mobile-optimized" />;
}