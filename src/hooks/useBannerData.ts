
import { useState, useEffect } from 'react';
import { bannersService, BannerResponse } from '@/services/api/bannersService';
import { Banner } from '@/types/banner';

export function useBannerData() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanners() {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await bannersService.getActiveBanners();
        
        // Map API response to Banner interface
        const formattedBanners: Banner[] = data.map((banner: BannerResponse) => ({
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          mediaType: banner.media_type,
          mediaUrl: banner.media_url,
          url: banner.url || '',
          ctaText: banner.cta_text,
        }));
        
        setBanners(formattedBanners);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBanners();
  }, []);

  return { banners, isLoading, error };
}
