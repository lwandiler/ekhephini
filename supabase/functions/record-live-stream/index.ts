import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecordingJob {
  showId: string;
  title: string;
  streamUrl: string;
  duration: number; // in seconds
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { showId, title, streamUrl, duration }: RecordingJob = await req.json();

      console.log(`Starting recording for show: ${title}`);

      // Start recording process
      const recordingId = crypto.randomUUID();
      
      // In a real implementation, you would:
      // 1. Use FFmpeg or similar to record the stream
      // 2. Save to temporary storage
      // 3. Convert to MP3
      // 4. Upload to Supabase storage
      // 5. Create database entry

      // For this example, we'll simulate the recording process
      const simulateRecording = async () => {
        try {
          // Simulate recording delay
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Generate a mock audio file URL (in production, this would be the actual recorded file)
          const fileName = `${recordingId}.mp3`;
          const audioUrl = `https://yfkdcqgmyyrcxppxcswz.supabase.co/storage/v1/object/public/recorded-shows/${fileName}`;

          // Create database entry
          const { error: dbError } = await supabaseClient
            .from('recorded_shows')
            .insert({
              id: recordingId,
              title,
              show_id: showId,
              audio_url: audioUrl,
              duration_seconds: duration,
              description: `Recorded show: ${title}`
            });

          if (dbError) {
            console.error('Database error:', dbError);
            return;
          }

          console.log(`Recording completed for show: ${title}`);
        } catch (error) {
          console.error('Recording failed:', error);
        }
      };

      // Start recording in background
      simulateRecording();

      return new Response(
        JSON.stringify({ 
          success: true, 
          recordingId,
          message: 'Recording started' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET request - check recording status
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const recordingId = url.searchParams.get('recordingId');

      if (!recordingId) {
        return new Response(
          JSON.stringify({ error: 'Recording ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseClient
        .from('recorded_shows')
        .select('*')
        .eq('id', recordingId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Recording not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ recording: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});