
import { supabaseApi } from './config';

export interface BannerResponse {
  id: string;
  title: string;
  subtitle?: string;
  media_type: 'image' | 'video';
  media_url: string;
  url?: string;
  cta_text?: string;
  active: boolean;
  display_order: number;
}

export const bannersService = {
  // Get all active banners ordered by display_order
  async getActiveBanners(): Promise<BannerResponse[]> {
    const response = await supabaseApi.get('/banners', {
      params: {
        active: 'eq.true',
        order: 'display_order.asc'
      }
    });
    return response.data;
  },

  // Get all banners (for admin)
  async getAllBanners(): Promise<BannerResponse[]> {
    const response = await supabaseApi.get('/banners', {
      params: {
        order: 'display_order.asc'
      }
    });
    return response.data;
  },

  // Create a new banner
  async createBanner(banner: Omit<BannerResponse, 'id'>): Promise<BannerResponse> {
    const response = await supabaseApi.post('/banners', banner);
    return response.data[0];
  },

  // Update a banner
  async updateBanner(id: string, banner: Partial<BannerResponse>): Promise<BannerResponse> {
    const response = await supabaseApi.patch(`/banners?id=eq.${id}`, banner);
    return response.data[0];
  },

  // Delete a banner
  async deleteBanner(id: string): Promise<void> {
    await supabaseApi.delete(`/banners?id=eq.${id}`);
  }
};
