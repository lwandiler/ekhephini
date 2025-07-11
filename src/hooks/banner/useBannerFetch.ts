
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseBannerToModel } from '@/utils/bannerUtils';

export function useBannerFetch(setIsLoading: (value: boolean) => void, setBanners: (banners: any[]) => void) {
  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching banners:", error);
        toast({
          variant: "destructive",
          title: "Error fetching banners",
          description: error.message,
        });
        return;
      }
      
      // Convert database format to our app format
      const formattedBanners = data.map(banner => mapDatabaseBannerToModel(banner));
      
      setBanners(formattedBanners);
    } catch (error) {
      console.error("Unexpected error fetching banners:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load banners. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load banners from Supabase on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  return { fetchBanners };
}
