
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  url: string;
  ctaText?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface BannerFormState {
  title: string;
  subtitle: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  url: string;
  ctaText: string;
  displayOrder: number;
  active: boolean;
}
