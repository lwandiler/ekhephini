import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Show {
  id: string;
  title: string;
  host: string;
  description: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  active: boolean;
}

interface ActiveRecording {
  id: string;
  show_id: string;
  title: string;
  started_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting auto-record check...');

    // Get current time and day
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format

    console.log(`Current day: ${currentDay}, Current time: ${currentTime}`);

    // Get today's active shows
    const { data: shows, error: showsError } = await supabaseClient
      .from('shows')
      .select('*')
      .eq('active', true)
      .eq('day_of_week', currentDay);

    if (showsError) {
      console.error('Error fetching shows:', showsError);
      throw showsError;
    }

    console.log(`Found ${shows?.length || 0} shows for today`);

    // Get current active recordings to avoid duplicates
    const { data: activeRecordings, error: recordingsError } = await supabaseClient
      .from('recorded_shows')
      .select('show_id, title')
      .gte('recorded_at', new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()); // Last 4 hours

    if (recordingsError) {
      console.error('Error fetching active recordings:', recordingsError);
    }

    const activeShowIds = new Set(activeRecordings?.map(r => r.show_id) || []);

    // Get station settings for stream URL
    const { data: stationSettings } = await supabaseClient
      .from('station_settings')
      .select('stream_url')
      .eq('id', 1)
      .single();

    const streamUrl = stationSettings?.stream_url || 'https://stream.zeno.fm/your-stream-url';

    let recordingsStarted = 0;

    // Check each show to see if it should be recording
    for (const show of shows || []) {
      const showStart = show.start_time;
      const showEnd = show.end_time;

      // Check if current time is within show time range
      if (currentTime >= showStart && currentTime <= showEnd) {
        // Check if we're not already recording this show
        if (!activeShowIds.has(show.id)) {
          console.log(`Starting recording for show: ${show.title}`);

          // Start recording
          const recordingId = crypto.randomUUID();
          
          // Calculate duration in seconds
          const startMinutes = timeToMinutes(showStart);
          const endMinutes = timeToMinutes(showEnd);
          let duration = endMinutes - startMinutes;
          
          // Handle shows that cross midnight
          if (duration < 0) {
            duration = (24 * 60) - startMinutes + endMinutes;
          }
          
          const durationSeconds = duration * 60;

          // Simulate recording process (in production, this would use FFmpeg)
          const backgroundRecording = async () => {
            try {
              // Wait a bit to simulate recording startup
              await new Promise(resolve => setTimeout(resolve, 5000));

              // Generate filename and URL
              const fileName = `${show.id}_${new Date().toISOString().split('T')[0]}_${recordingId}.mp3`;
              const audioUrl = `https://yfkdcqgmyyrcxppxcswz.supabase.co/storage/v1/object/public/recorded-shows/${fileName}`;

              // Create database entry
              const { error: dbError } = await supabaseClient
                .from('recorded_shows')
                .insert({
                  id: recordingId,
                  title: show.title,
                  show_id: show.id,
                  audio_url: audioUrl,
                  duration_seconds: durationSeconds,
                  description: `Auto-recorded: ${show.title} - ${show.description || ''}`
                });

              if (dbError) {
                console.error('Database error:', dbError);
                return;
              }

              console.log(`Recording created for show: ${show.title}`);
            } catch (error) {
              console.error('Recording failed:', error);
            }
          };

          // Start recording in background
          backgroundRecording();
          recordingsStarted++;
        } else {
          console.log(`Show ${show.title} is already being recorded`);
        }
      }
    }

    console.log(`Auto-record check completed. Started ${recordingsStarted} new recordings.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${shows?.length || 0} shows, started ${recordingsStarted} recordings`,
        currentTime,
        currentDay
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-record:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to convert time string to minutes
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}