import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

const VehicleGallery = ({ images = [], title = 'Vehicle' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images.length > 0 ? images : [fallbackImage];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={displayImages[currentIndex]}
            alt={`${title} - Photo ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover select-none cursor-pointer"
            onClick={() => setIsFullscreen(true)}
          />
        </AnimatePresence>

        {/* Previous / Next Controls */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 hover:bg-navy-900 text-white flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Trigger */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Fullscreen</span>
        </button>

        {/* Photo Index Indicator */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium">
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-gold-500 scale-105 shadow-md'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
            <img
              src={displayImages[currentIndex]}
              alt={`${title} fullscreen`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleGallery;
