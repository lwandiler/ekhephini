
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BannerSlide from './banner/BannerSlide';
import CarouselIndicators from './banner/CarouselIndicators';
import { supabase } from '@/integrations/supabase/client';
import { Banner } from '@/types/banner';
import { mapDatabaseBannerToModel } from '@/utils/bannerUtils';

const HeroBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('active', true)
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error("Error fetching banners:", error);
          return;
        }
        
        // Convert database format to our app format
        const formattedBanners = data.map(banner => mapDatabaseBannerToModel(banner));
        setBanners(formattedBanners);
      } catch (error) {
        console.error("Unexpected error fetching banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading banners...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Ekhepini Community Radio</h2>
          <p className="text-gray-300">Your friend to rely on Ekhepini 96.9 FM</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden bg-gray-900">
      {/* Banner Slides */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full">
            <BannerSlide banner={banner} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <CarouselIndicators
          count={banners.length}
          currentIndex={currentSlide}
          onClick={goToSlide}
        />
      )}
    </div>
  );
};

export default HeroBannerCarousel;
