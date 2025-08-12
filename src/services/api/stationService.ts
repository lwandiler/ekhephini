
import { supabaseApi } from './config';
import { supabase } from '@/integrations/supabase/client';

export interface StationSettingsResponse {
  id: string;
  station_name: string;
  tagline?: string;
  description?: string;
  stream_url?: string;
  backup_stream_url?: string;
  recording_stream_url?: string; // keep optional for backward compat
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
      // Use Supabase client to avoid hardcoded REST key issues and wrong IDs
      const { data, error } = await supabase
        .from('station_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching station settings (client):', error);
        return null;
      }

      return data as unknown as StationSettingsResponse | null;
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
