
import { Json } from "@/integrations/supabase/types";

// Define social links interface for type safety
export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

// Define contact info interface for type safety
export interface ContactInfo {
  email: string;
  phone: string;
}

// Default station settings for social links and contact info
export const defaultSocialLinks: SocialLinks = {
  facebook: "https://facebook.com/clickradio",
  twitter: "https://twitter.com/clickradio",
  instagram: "https://instagram.com/clickradio",
  youtube: "https://youtube.com/clickradio"
};

export const defaultContactInfo: ContactInfo = {
  email: "contact@clickradio.com",
  phone: "+1 (123) 456-7890"
};

// Safely extract a value from Json data with proper type checking
function safeJsonExtract(data: Json | null | undefined, key: string): Json | null {
  if (data && typeof data === 'object' && !Array.isArray(data) && data !== null && key in data) {
    return data[key];
  }
  return null;
}

// Extract social links from data with type safety
export function extractSocialLinks(data: Json | null | undefined): SocialLinks {
  // Return default if data is null, undefined, or not an object
  if (!data || typeof data !== 'object' || Array.isArray(data) || data === null) {
    return { ...defaultSocialLinks };
  }

  // Create default structure with all required properties
  const socialLinks: SocialLinks = { ...defaultSocialLinks };
  
  // Try to extract social_links from data if it exists
  const socialLinksData = safeJsonExtract(data, 'social_links');
  
  // If we have social_links data and it's an object, extract values from it
  if (socialLinksData && typeof socialLinksData === 'object' && !Array.isArray(socialLinksData)) {
    if ('facebook' in socialLinksData && socialLinksData.facebook !== null) {
      socialLinks.facebook = String(socialLinksData.facebook);
    }
    if ('twitter' in socialLinksData && socialLinksData.twitter !== null) {
      socialLinks.twitter = String(socialLinksData.twitter);
    }
    if ('instagram' in socialLinksData && socialLinksData.instagram !== null) {
      socialLinks.instagram = String(socialLinksData.instagram);
    }
    if ('youtube' in socialLinksData && socialLinksData.youtube !== null) {
      socialLinks.youtube = String(socialLinksData.youtube);
    }
  } 
  // If social_links isn't available, try to extract directly from the data
  else {
    if ('facebook' in data && data.facebook !== null) {
      socialLinks.facebook = String(data.facebook);
    }
    if ('twitter' in data && data.twitter !== null) {
      socialLinks.twitter = String(data.twitter);
    }
    if ('instagram' in data && data.instagram !== null) {
      socialLinks.instagram = String(data.instagram);
    }
    if ('youtube' in data && data.youtube !== null) {
      socialLinks.youtube = String(data.youtube);
    }
  }
  
  return socialLinks;
}

// Extract contact info from data with type safety
export function extractContactInfo(data: Json | null | undefined): ContactInfo {
  // Return default if data is null, undefined, or not an object
  if (!data || typeof data !== 'object' || Array.isArray(data) || data === null) {
    return { ...defaultContactInfo };
  }

  // Create default structure with all required properties
  const contactInfo: ContactInfo = { ...defaultContactInfo };
  
  // Try to extract contact_info from data if it exists
  const contactInfoData = safeJsonExtract(data, 'contact_info');
  
  // If we have contact_info data and it's an object, extract values from it
  if (contactInfoData && typeof contactInfoData === 'object' && !Array.isArray(contactInfoData)) {
    if ('email' in contactInfoData && contactInfoData.email !== null) {
      contactInfo.email = String(contactInfoData.email);
    }
    if ('phone' in contactInfoData && contactInfoData.phone !== null) {
      contactInfo.phone = String(contactInfoData.phone);
    }
  } 
  // If contact_info isn't available, try to extract directly from the data
  else {
    if ('email' in data && data.email !== null) {
      contactInfo.email = String(data.email);
    }
    if ('phone' in data && data.phone !== null) {
      contactInfo.phone = String(data.phone);
    }
  }
  
  return contactInfo;
}
