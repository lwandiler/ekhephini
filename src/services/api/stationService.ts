
import { supabaseApi } from './config';
import { supabase } from '@/integrations/supabase/client';

export interface StationSettingsResponse {
  id: number;
  station_name: string;
  station_tagline?: string;
  station_description?: string;
  stream_url?: string;
  recording_stream_url?: string;
  logo_url?: string;
  social_links?: Record<string, string>;
  contact_info?: Record<string, string>;
  page_content?: Record<string, string>;
  updated_at?: string;
}

export const stationService = {
  // Get station settings
  async getStationSettings(): Promise<StationSettingsResponse | null> {
    try {
      const response = await supabaseApi.get('/station_settings', {
        params: {
          id: 'eq.1'
        }
      });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching station settings:', error);
      return null;
    }
  },

  // Update station settings
  async updateStationSettings(settings: Partial<StationSettingsResponse>): Promise<StationSettingsResponse> {
    const settingsData = {
      ...settings,
      updated_at: new Date().toISOString()
    };
    
    const response = await supabaseApi.patch('/station_settings?id=eq.1', settingsData);
    
    // If recording_stream_url was updated, trigger URL updates for existing recordings
    if (settings.recording_stream_url !== undefined) {
      console.log('Recording stream URL updated, triggering recording URLs update...');
      try {
        const { data, error } = await supabase.functions.invoke('update-recording-urls');
        if (error) {
          console.error('Error updating recording URLs:', error);
        } else {
          console.log('Recording URLs update completed:', data);
        }
      } catch (error) {
        console.error('Failed to trigger recording URLs update:', error);
      }
    }
    
    return response.data[0];
  }
};
