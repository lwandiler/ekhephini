
import { ThemeOptions } from "@/types/theme";
import { 
  loadThemeFromStorage,
  saveThemeToStorage,
  applyThemeToDocument 
} from "./settings/themeManager";

import { 
  SocialLinks, 
  ContactInfo, 
  extractSocialLinks, 
  extractContactInfo,
  defaultSocialLinks,
  defaultContactInfo 
} from "./settings/dataExtractors";

import { 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  forceSettingsRefresh 
} from "./settings/storageManager";

import { 
  loadSettingsFromDatabase 
} from "./settings/databaseManager";

// Default station settings
export const defaultStationSettings = {
  stationName: "Ekhepini Community Radio",
  stationTagline: "Your friend to rely on Ekhepini 96.9 FM",
  stationDescription: "Ekhepini Community Radio Station - Your trusted voice in the community, broadcasting on 96.9 FM.",
  streamUrl: "https://streamlive-edge-01.broadsmart-streaming.co.za:5443/mdda/streams/mcr128kbps.m3u8",
  logoUrl: "/lovable-uploads/38150e55-823d-433a-8672-ae40d2fcf2da.png",
  socialLinks: defaultSocialLinks,
  contactInfo: defaultContactInfo
};

// Export all functions and types from the module files
export {
  // Theme management
  loadThemeFromStorage,
  saveThemeToStorage,
  applyThemeToDocument,
  
  // Data extraction
  extractSocialLinks,
  extractContactInfo,
  
  // Storage management
  loadSettingsFromStorage,
  saveSettingsToStorage,
  forceSettingsRefresh,
  
  // Database operations
  loadSettingsFromDatabase
};

// Also export types for broader usage
export type { SocialLinks, ContactInfo };
