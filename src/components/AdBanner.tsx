
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdBannerProps {
  imageUrl?: string;
  link?: string;
  position?: 'top' | 'sidebar';
  title?: string;
  isDismissable?: boolean;
}

const AdBanner = ({
  imageUrl,
  link,
  position = "top",
  title,
  isDismissable = true
}: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [adData, setAdData] = useState<{
    title: string;
    imageUrl: string;
    link: string;
  } | null>(null);
  
  // Fetch active ads from database for the specified position
  useEffect(() => {
    const fetchAds = async () => {
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
          const randomAd = ads[Math.floor(Math.random() * ads.length)];
          console.log('Selected ad:', randomAd);
          setAdData({
            title: title || randomAd.title,
            imageUrl: imageUrl || randomAd.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            link: link || randomAd.click_url || "#"
          });
        } else {
          console.log('No ads found, using fallback');
          setAdData({
            title: title || "Advertisement",
            imageUrl: imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            link: link || "#"
          });
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAdData({
          title: title || "Advertisement",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          link: link || "#"
        });
      }
    };

    fetchAds();
  }, [imageUrl, link, position, title]);
  
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
