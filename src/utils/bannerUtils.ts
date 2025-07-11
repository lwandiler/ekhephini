
import { supabase } from '@/integrations/supabase/client';
import { Banner, BannerFormState } from '@/types/banner';

// Function to map database banner to frontend banner model
export function mapDatabaseBannerToModel(dbBanner: any): Banner {
  return {
    id: dbBanner.id,
    title: dbBanner.title,
    subtitle: dbBanner.subtitle || undefined,
    mediaType: dbBanner.media_type as 'image' | 'video',
    mediaUrl: dbBanner.media_url,
    url: dbBanner.url || '',
    ctaText: dbBanner.cta_text || undefined,
    displayOrder: dbBanner.display_order,
    active: dbBanner.active
  };
}

// Function to map frontend banner model to database fields
export function mapModelToDatabaseBanner(banner: BannerFormState) {
  return {
    title: banner.title,
    subtitle: banner.subtitle || null,
    media_type: banner.mediaType,
    media_url: banner.mediaUrl,
    url: banner.url || null,
    cta_text: banner.ctaText || null,
    display_order: banner.displayOrder || 0,
    active: banner.active
  };
}

// Function to get the default banner form state
export function getDefaultBannerFormState(): BannerFormState {
  return {
    title: "",
    subtitle: "",
    mediaType: "image",
    mediaUrl: "",
    url: "",
    ctaText: "",
    displayOrder: 0,
    active: true
  };
}
