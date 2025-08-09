'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  original_name: string;
  uploader_name?: string;
  album_name?: string;
}

interface BasicLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BasicLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose
}: BasicLightboxProps) {
  const [localIndex, setLocalIndex] = useState(currentIndex);

  const goToPrevious = () => {
    setLocalIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setLocalIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen || !photos[localIndex]) return null;

  const currentPhoto = photos[localIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Image */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.url}
          alt={currentPhoto.original_name}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: '90vh', maxWidth: '90vw' }}
        />

        {/* Navigation Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-sm">
            {localIndex + 1} / {photos.length}
          </div>
        )}

        {/* Photo Info */}
        {currentPhoto.uploader_name && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
            {currentPhoto.uploader_name}
          </div>
        )}
      </div>
    </div>
  );
}