
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
  stationName: "Click Radio",
  stationTagline: "Music for everyone",
  stationDescription: "Your community radio station with shows, podcasts, news and more.",
  streamUrl: "https://kexp.streamguys1.com/kexp128.mp3",
  logoUrl: "/placeholder.svg",
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
