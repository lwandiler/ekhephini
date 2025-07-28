import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting recording URLs update...');

    // Get the current recording stream URL from station settings
    const { data: stationSettings, error: settingsError } = await supabaseClient
      .from('station_settings')
      .select('recording_stream_url, stream_url')
      .eq('id', 1)
      .single();

    if (settingsError) {
      console.error('Error fetching station settings:', settingsError);
      throw settingsError;
    }

    // Use recording_stream_url if available, otherwise fall back to stream_url
    const newBaseUrl = stationSettings?.recording_stream_url || stationSettings?.stream_url;

    if (!newBaseUrl) {
      return new Response(
        JSON.stringify({ error: 'No recording stream URL configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('New base recording URL:', newBaseUrl);

    // Get all existing recordings that aren't expired
    const { data: existingRecordings, error: recordingsError } = await supabaseClient
      .from('recorded_shows')
      .select('id, title, audio_url, recorded_at')
      .gt('expires_at', new Date().toISOString());

    if (recordingsError) {
      console.error('Error fetching recordings:', recordingsError);
      throw recordingsError;
    }

    console.log(`Found ${existingRecordings?.length || 0} recordings to update`);

    let updatedCount = 0;

    // Function to extract timestamp from existing URL or generate from recorded_at
    const extractOrGenerateTimestamp = (audioUrl: string, recordedAt: string): string => {
      // Try to extract existing timestamp from URL pattern: index-{timestamp}-3600.m3u8
      const timestampMatch = audioUrl.match(/index-(\d+)-3600\.m3u8/);
      if (timestampMatch) {
        return timestampMatch[1];
      }
      
      // Generate timestamp from recorded_at (1 hour before recording time)
      const recordedDate = new Date(recordedAt);
      const oneHourBefore = new Date(recordedDate.getTime() - 60 * 60 * 1000);
      return Math.floor(oneHourBefore.getTime() / 1000).toString();
    };

    // Update each recording URL
    for (const recording of existingRecordings || []) {
      try {
        const timestamp = extractOrGenerateTimestamp(recording.audio_url, recording.recorded_at);
        
        // Generate new URL with the updated base URL
        const newUrl = newBaseUrl.replace(
          /\/index\.m3u8$/,
          `/index-${timestamp}-3600.m3u8`
        );

        console.log(`Updating recording ${recording.id}:`);
        console.log(`  Old URL: ${recording.audio_url}`);
        console.log(`  New URL: ${newUrl}`);

        // Update the recording URL
        const { error: updateError } = await supabaseClient
          .from('recorded_shows')
          .update({ audio_url: newUrl })
          .eq('id', recording.id);

        if (updateError) {
          console.error(`Error updating recording ${recording.id}:`, updateError);
        } else {
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error processing recording ${recording.id}:`, error);
      }
    }

    console.log(`Successfully updated ${updatedCount} recording URLs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updatedCount} recording URLs`,
        updatedCount,
        totalRecordings: existingRecordings?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating recording URLs:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});