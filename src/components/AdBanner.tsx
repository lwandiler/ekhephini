
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdBannerProps {
  imageUrl?: string;
  link?: string;
  position?: 'top' | 'sidebar';
  title?: string;
  isDismissable?: boolean;
}

interface AdData {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  duration: number;
}

const AdBanner = ({
  imageUrl,
  link,
  position = "top",
  title,
  isDismissable = true
}: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [adData, setAdData] = useState<AdData | null>(null);
  const [allAds, setAllAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  // Fetch active ads from database for the specified position
  const fetchAds = useCallback(async () => {
    try {
      console.log('Fetching ads for position:', position);
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from('ads')
        .select('*')
        .eq('active', true);

      // Only filter by position if specified and not 'top' (which can show any position)
      if (position !== 'top') {
        query = query.eq('position', position);
      }

      const { data: ads, error } = await query
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Supabase error fetching ads:', error);
        throw error;
      }

      console.log('Fetched ads:', ads);

      if (ads && ads.length > 0) {
        setAllAds(ads);
        // Start with the first ad or override with provided props
        const firstAd = ads[0];
        setAdData({
          id: firstAd.id,
          title: title || firstAd.title,
          imageUrl: imageUrl || firstAd.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          link: link || firstAd.click_url || "#",
          duration: firstAd.display_duration_seconds || 30
        });
      } else {
        console.log('No ads found, using fallback');
        setAdData({
          id: 'fallback',
          title: title || "Advertisement",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          link: link || "#",
          duration: 30
        });
        setAllAds([]);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAdData({
        id: 'error',
        title: title || "Advertisement",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        link: link || "#",
        duration: 30
      });
      setAllAds([]);
    }
  }, [imageUrl, link, position, title]);

  // Rotate to next ad
  const rotateToNextAd = useCallback(() => {
    if (allAds.length <= 1) return;
    
    const nextIndex = (currentAdIndex + 1) % allAds.length;
    const nextAd = allAds[nextIndex];
    
    setCurrentAdIndex(nextIndex);
    setAdData({
      id: nextAd.id,
      title: title || nextAd.title,
      imageUrl: imageUrl || nextAd.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: link || nextAd.click_url || "#",
      duration: nextAd.display_duration_seconds || 30
    });
  }, [allAds, currentAdIndex, title, imageUrl, link]);

  // Set up rotation timer
  useEffect(() => {
    if (!adData || allAds.length <= 1) return;

    const timer = setTimeout(() => {
      rotateToNextAd();
    }, adData.duration * 1000);

    return () => clearTimeout(timer);
  }, [adData, allAds.length, rotateToNextAd]);

  // Initial fetch
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);
  
  if (!isVisible || !adData) return null;
  
  if (position === "top") {
    return (
      <div className="relative bg-gray-100 w-full mb-6 transition-all hover:shadow-lg">
        <div className="container mx-auto p-2">
          <div className="flex justify-center items-center">
            <span className="text-xs text-gray-500 absolute top-1 left-2">{adData.title}</span>
            <a href={adData.link} target="_blank" rel="noopener noreferrer" className="block w-full">
              <img 
                src={adData.imageUrl} 
                alt={`${adData.title} Advertisement`} 
                className="h-24 md:h-32 w-full object-cover rounded"
              />
            </a>
          </div>
          
          {isDismissable && (
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 bg-white/70 rounded-full p-1"
              aria-label="Close advertisement"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6 transition-all hover:shadow-lg">
      <span className="text-xs text-gray-500 absolute top-1 left-2 z-10 bg-white/70 px-1 rounded">{adData.title}</span>
      <a href={adData.link} target="_blank" rel="noopener noreferrer">
        <img 
          src={adData.imageUrl} 
          alt={`${adData.title} Advertisement`} 
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
      </a>
      
      {isDismissable && (
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 bg-white/70 rounded-full p-1"
          aria-label="Close advertisement"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AdBanner;
