
import { stationService } from '@/services/api/stationService';
import { extractSocialLinks, extractContactInfo } from './dataExtractors';
import { defaultStationSettings } from '../stationSettingsManager';

// Load settings from database using REST API
export async function loadSettingsFromDatabase() {
  try {
    const data = await stationService.getStationSettings();
    
    if (data) {
      return {
        stationName: data.station_name || defaultStationSettings.stationName,
        stationTagline: data.tagline || defaultStationSettings.stationTagline,
        stationDescription: data.description || defaultStationSettings.stationDescription,
        streamUrl: data.stream_url || defaultStationSettings.streamUrl,
        recordingStreamUrl: data.backup_stream_url || undefined,
        logoUrl: data.logo_url || defaultStationSettings.logoUrl,
        socialLinks: extractSocialLinks((data as any).social_links),
        contactInfo: extractContactInfo((data as any).contact_info)
      } as any;
    }
    
    return null;
  } catch (e) {
    console.error("Error in loadSettingsFromDatabase:", e);
    return null;
  }
}
