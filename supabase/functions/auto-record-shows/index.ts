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

// Function to record from stream URL
async function recordFromStream(streamUrl: string, durationSeconds: number = 3600): Promise<Uint8Array> {
  console.log(`Starting recording from stream: ${streamUrl}`);
  
  try {
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RadioRecorder/1.0)',
        'Accept': 'audio/*,*/*;q=0.9',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to stream: ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('No stream data available');
    }
    
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const maxBytes = durationSeconds * 128 * 1024 / 8; // Estimate for 128kbps audio
    
    const startTime = Date.now();
    const maxDuration = durationSeconds * 1000; // Convert to milliseconds
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        if (Date.now() - startTime > maxDuration) break;
        if (totalBytes > maxBytes) break;
        
        if (value) {
          chunks.push(value);
          totalBytes += value.length;
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    // Combine all chunks into a single Uint8Array
    const result = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    console.log(`Recording completed. Captured ${totalBytes} bytes in ${Date.now() - startTime}ms`);
    return result;
    
  } catch (error) {
    console.error('Error recording from stream:', error);
    throw error;
  }
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

    // Get station settings for recording stream URL
    const { data: stationSettings } = await supabaseClient
      .from('station_settings')
      .select('recording_stream_url')
      .eq('id', 1)
      .single();

    const baseRecordingUrl = stationSettings?.recording_stream_url;

    let recordingsStarted = 0;

    // Check for shows that are currently running or just ended to record hourly segments
    // Logic: At 10:00, we want to record the previous hour (9:00-10:00)
    for (const show of shows || []) {
      const showStart = show.start_time;
      const showEnd = show.end_time;
      const currentHour = now.getHours().toString().padStart(2, '0') + ':00:00';
      
      // Calculate show duration in hours
      const startMinutes = timeToMinutes(showStart);
      const endMinutes = timeToMinutes(showEnd);
      let durationMinutes = endMinutes - startMinutes;
      
      // Handle shows that cross midnight
      if (durationMinutes < 0) {
        durationMinutes = (24 * 60) - startMinutes + endMinutes;
      }
      
      const showDurationHours = Math.floor(durationMinutes / 60);
      
      // Check if current time is within or just after the show time range
      const currentMinutes = timeToMinutes(currentHour);
      let isInShowTimeRange = false;
      
      if (startMinutes <= endMinutes) {
        // Show doesn't cross midnight
        isInShowTimeRange = currentMinutes > startMinutes && currentMinutes <= endMinutes;
      } else {
        // Show crosses midnight
        isInShowTimeRange = currentMinutes > startMinutes || currentMinutes <= endMinutes;
      }
      
      if (isInShowTimeRange) {
        // Calculate which hour of the show we should record
        let hourToRecord = 1;
        if (startMinutes <= endMinutes) {
          hourToRecord = Math.floor((currentMinutes - startMinutes) / 60) + 1;
        } else {
          // Handle midnight crossing
          if (currentMinutes > startMinutes) {
            hourToRecord = Math.floor((currentMinutes - startMinutes) / 60) + 1;
          } else {
            hourToRecord = Math.floor(((24 * 60) - startMinutes + currentMinutes) / 60) + 1;
          }
        }
        
        // Only record if we haven't exceeded the show duration
        if (hourToRecord <= showDurationHours) {
          // Check if we haven't already recorded this specific hour today
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          const { data: existingRecording } = await supabaseClient
            .from('recorded_shows')
            .select('id')
            .eq('show_id', show.id)
            .gte('recorded_at', todayStart)
            .ilike('title', `%Hour ${hourToRecord}%`)
            .single();

          if (!existingRecording) {
            console.log(`Starting recording for show: ${show.title} - Hour ${hourToRecord}`);

            // Start recording
            const recordingId = crypto.randomUUID();
            
            // Each recording is 1 hour (3600 seconds)
            const durationSeconds = 3600;

            // Generate timestamped recording URL
            const generateRecordingUrl = (baseUrl: string): string => {
              if (!baseUrl) return '';
              
              // Calculate timestamp for one hour ago
              const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
              const unixTimestamp = Math.floor(oneHourAgo.getTime() / 1000);
              
              // Transform URL: insert timestamp and duration between 'index' and '.m3u8'
              // Example: index.m3u8 becomes index-1753221840-3600.m3u8
              const transformedUrl = baseUrl.replace(
                /index\.m3u8$/,
                `index-${unixTimestamp}-3600.m3u8`
              );
              
              console.log(`Generated recording URL: ${transformedUrl}`);
              return transformedUrl;
            };

            // Generate recording URL and store in database
            const storeRecordingUrl = async () => {
              try {
                if (!baseRecordingUrl) {
                  console.error('No recording stream URL configured');
                  return;
                }

                // Generate timestamped recording URL for the previous hour
                const recordingUrl = generateRecordingUrl(baseRecordingUrl);
                
                console.log(`Generated recording URL for ${show.title}: ${recordingUrl}`);

                // Create database entry with the recording stream URL
                const { error: dbError } = await supabaseClient
                  .from('recorded_shows')
                  .insert({
                    id: recordingId,
                    title: `${show.title} - Hour ${hourToRecord}`,
                    show_id: show.id,
                    audio_url: recordingUrl,
                    duration_seconds: durationSeconds,
                    file_size_bytes: null, // Not applicable for stream URLs
                    description: `Catch-up recording: ${show.title} hosted by ${show.host} - Hour ${hourToRecord} of ${showDurationHours}`
                  });

                if (dbError) {
                  console.error('Database error:', dbError);
                  return;
                }

                console.log(`Recording URL stored for show: ${show.title} with URL: ${recordingUrl}`);
              } catch (error) {
                console.error('Recording URL storage failed:', error);
              }
            };

            // Store recording URL
            storeRecordingUrl();
            recordingsStarted++;
          } else {
            console.log(`Show ${show.title} already recorded today`);
          }
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