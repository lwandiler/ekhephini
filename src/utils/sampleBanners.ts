
import { supabase } from '@/integrations/supabase/client';

export const sampleRadioBanners = [
  {
    title: "Listen Live - MCRS 96.9 FM",
    subtitle: "Your favorite music, news, and entertainment 24/7",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop",
    url: "#",
    cta_text: "Listen Now",
    active: true,
    display_order: 1
  },
  {
    title: "Morning Show with DJ Mike",
    subtitle: "Start your day with the best music and latest news",
    media_type: "image", 
    media_url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1200&h=600&fit=crop",
    url: "#",
    cta_text: "Join Us Live",
    active: true,
    display_order: 2
  },
  {
    title: "Community Events & Updates",
    subtitle: "Stay connected with local happenings in Ekhepini",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop",
    url: "#",
    cta_text: "Learn More",
    active: true,
    display_order: 3
  },
  {
    title: "Request Your Favorite Songs",
    subtitle: "Call us or message us to play your favorite tracks",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&sat=-100",
    url: "#",
    cta_text: "Make a Request",
    active: true,
    display_order: 4
  },
  {
    title: "Local Business Spotlight",
    subtitle: "Supporting our community businesses",
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    url: "#",
    cta_text: "Get Featured",
    active: true,
    display_order: 5
  }
];

export async function addSampleBanners() {
  try {
    console.log('Adding sample banners to database...');
    
    const { data, error } = await supabase
      .from('banners')
      .insert(sampleRadioBanners)
      .select();
    
    if (error) {
      console.error('Error adding sample banners:', error);
      throw error;
    }
    
    console.log('Successfully added sample banners:', data);
    return data;
  } catch (error) {
    console.error('Failed to add sample banners:', error);
    throw error;
  }
}

export async function clearExistingBanners() {
  try {
    console.log('Clearing existing banners...');
    
    const { error } = await supabase
      .from('banners')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      console.error('Error clearing banners:', error);
      throw error;
    }
    
    console.log('Successfully cleared existing banners');
  } catch (error) {
    console.error('Failed to clear banners:', error);
    throw error;
  }
}
