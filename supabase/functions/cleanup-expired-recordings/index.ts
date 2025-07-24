import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Starting cleanup of expired recordings...');

    // Get expired recordings
    const { data: expiredRecordings, error: fetchError } = await supabaseClient
      .from('recorded_shows')
      .select('id, audio_url')
      .lt('expires_at', new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!expiredRecordings || expiredRecordings.length === 0) {
      console.log('No expired recordings found');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No expired recordings found',
          cleaned: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${expiredRecordings.length} expired recordings`);

    // Delete files from storage and database entries
    let cleanedCount = 0;
    
    for (const recording of expiredRecordings) {
      try {
        // Extract file path from URL for storage deletion
        const urlParts = recording.audio_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        // Delete from storage
        const { error: storageError } = await supabaseClient.storage
          .from('recorded-shows')
          .remove([fileName]);

        if (storageError) {
          console.error(`Failed to delete storage file ${fileName}:`, storageError);
        }

        // Delete from database
        const { error: dbError } = await supabaseClient
          .from('recorded_shows')
          .delete()
          .eq('id', recording.id);

        if (dbError) {
          console.error(`Failed to delete database record ${recording.id}:`, dbError);
        } else {
          cleanedCount++;
          console.log(`Cleaned up recording: ${recording.id}`);
        }

      } catch (error) {
        console.error(`Error cleaning up recording ${recording.id}:`, error);
      }
    }

    console.log(`Cleanup completed. Cleaned ${cleanedCount} recordings.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleanup completed`,
        cleaned: cleanedCount,
        total: expiredRecordings.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});