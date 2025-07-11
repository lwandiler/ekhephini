
import React, { useState, useEffect, useCallback } from 'react';
import BannerSlide from './banner/BannerSlide';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBannerData } from '@/hooks/useBannerData';

const HeroBannerCarousel: React.FC = () => {
  const { banners, isLoading, error } = useBannerData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  // If loading or error, display appropriate UI
  if (isLoading) {
    return (
      <div className="h-[400px] sm:h-[500px] w-full bg-gray-100 animate-pulse"></div>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Current slide */}
        {banners[currentSlide] && (
          <BannerSlide key={banners[currentSlide].id} banner={banners[currentSlide]} />
        )}
        
        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}
        
        {/* Slide indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBannerCarousel;
