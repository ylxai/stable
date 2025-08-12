'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { OptimizedImage } from './ui/optimized-image';
import { FloatingParticles, MorphingLoader } from './ui/engaging-loading';

interface SlideshowPhoto {
  id: string;
  url: string;
  original_name: string;
  optimized_images?: any;
}

interface HeroSlideshowProps {
  autoplay?: boolean;
  interval?: number;
  showControls?: boolean;
  className?: string;
}

export default function HeroSlideshow({ 
  autoplay = true, 
  interval = 5000,
  showControls = true,
  className = ''
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Fetch slideshow photos
  const { data: photos, isLoading, error } = useQuery<SlideshowPhoto[]>({
    queryKey: ['slideshowPhotos'],
    queryFn: async () => {
      const response = await fetch('/api/slideshow');
      if (!response.ok) {
        throw new Error('Failed to fetch slideshow photos');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && photos && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, photos, interval]);

  // Navigation functions
  const goToPrevious = () => {
    if (isTransitioning || !photos) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev === 0 ? photos.length - 1 : prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning || !photos) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev === photos.length - 1 ? 0 : prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || !photos) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && photos && photos.length > 1) {
      goToNext();
    }
    if (isRightSwipe && photos && photos.length > 1) {
      goToPrevious();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative bg-gradient-to-br from-wedding-ivory to-white ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <MorphingLoader />
        </div>
        <FloatingParticles count={6} />
      </div>
    );
  }

  // Error or no photos - show fallback
  if (error || !photos || photos.length === 0) {
    return (
      <div className={`relative bg-gradient-to-br from-wedding-ivory to-white flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            HafiPortrait
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Professional Photography Services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-wedding-gold hover:bg-wedding-gold/90 text-black">
              Lihat Portfolio
            </Button>
            <Button size="lg" variant="outline">
              Hubungi Kami
            </Button>
          </div>
        </div>
        <FloatingParticles count={8} />
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentPhoto.optimized_images ? (
          <OptimizedImage
            images={currentPhoto.optimized_images}
            alt={currentPhoto.original_name}
            usage="lightbox"
            className={`w-full h-full object-cover transition-all duration-500 ${
              isTransitioning ? 'opacity-70 scale-105' : 'opacity-100 scale-100'
            }`}
            priority={true}
          />
        ) : (
          <img
            src={currentPhoto.url}
            alt={currentPhoto.original_name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isTransitioning ? 'opacity-70 scale-105' : 'opacity-100 scale-100'
            }`}
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in-up">
            HafiPortrait
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Setiap Frame Bercerita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Button size="lg" className="bg-wedding-gold hover:bg-wedding-gold/90 text-black">
              Lihat Portfolio
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && photos.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20 hidden md:flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20 hidden md:flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-wedding-gold scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium bg-black/30 px-3 py-1 rounded-full md:hidden">
            ← Geser untuk navigasi →
          </div>
        </>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm z-20">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}