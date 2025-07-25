
export type ThemeType = 'classic' | 'modern' | 'minimalist';
export type FontFamily = 'inter' | 'roboto' | 'playfair';
export type FontSize = 'small' | 'medium' | 'large';
export type ColorScheme = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink';

export interface ThemeOptions {
  type: ThemeType;
  fontFamily: FontFamily;
  fontSize: FontSize;
  colorScheme: ColorScheme;
}

export interface StationSettings {
  stationName: string;
  stationTagline: string;
  stationDescription: string;
  streamUrl: string;
  recordingStreamUrl?: string;
  logoUrl: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
}
