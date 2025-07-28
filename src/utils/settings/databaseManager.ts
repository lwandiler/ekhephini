
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
        stationTagline: data.station_tagline || defaultStationSettings.stationTagline,
        stationDescription: data.station_description || defaultStationSettings.stationDescription,
        streamUrl: data.stream_url || defaultStationSettings.streamUrl,
        recordingStreamUrl: data.recording_stream_url || undefined,
        logoUrl: data.logo_url || defaultStationSettings.logoUrl,
        socialLinks: extractSocialLinks(data.social_links),
        contactInfo: extractContactInfo(data.contact_info)
      };
    }
    
    return null;
  } catch (e) {
    console.error("Error in loadSettingsFromDatabase:", e);
    return null;
  }
}
