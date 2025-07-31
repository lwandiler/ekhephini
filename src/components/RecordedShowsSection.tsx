import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Calendar } from 'lucide-react';
import { CatchUpPlayer } from './CatchUpPlayer';
import { StationContext } from '@/contexts/StationContext';
import { filterAvailableRecordings } from '@/utils/recordingUtils';
import { format } from 'date-fns';

interface RecordedShow {
  id: string;
  title: string;
  description: string | null;
  show_id: string | null;
  recorded_at: string;
  audio_url: string;
  duration_seconds: number | null;
  expires_at: string;
  shows?: {
    title: string;
    host: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    description?: string | null;
    image_url?: string | null;
  } | null;
}

interface Show {
  id: string;
  title: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description?: string | null;
  image_url?: string | null;
}

export const RecordedShowsSection: React.FC = () => {
  const { settings } = useContext(StationContext);
  const [recordedShows, setRecordedShows] = useState<RecordedShow[]>([]);
  const [allShows, setAllShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState<{
    audioUrl: string;
    title: string;
    showTitle: string;
  } | null>(null);

  useEffect(() => {
    loadRecordedShows();
  }, []);

  const loadRecordedShows = async () => {
    try {
      const [recordedResponse, showsResponse] = await Promise.all([
        supabase
          .from('recorded_shows')
          .select(`
            *,
            shows (
              title,
              host,
              day_of_week,
              start_time,
              end_time,
              description,
              image_url
            )
          `)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('shows')
          .select('*')
          .eq('active', true)
      ]);

      if (recordedResponse.error) throw recordedResponse.error;
      if (showsResponse.error) throw showsResponse.error;

      const allRecordings = recordedResponse.data || [];
      const shows = showsResponse.data || [];
      
      // Filter to only show available recordings (within 3-day window)
      const availableRecordings = filterAvailableRecordings(allRecordings, shows);
      
      setRecordedShows(availableRecordings);
      setAllShows(shows);
    } catch (error) {
      console.error('Error loading recorded shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const playRecording = (recording: RecordedShow) => {
    // Update audio URL to use recording stream URL from settings if available
    let audioUrl = recording.audio_url;
    
    // If we have a recording stream URL in settings, try to use it as base
    if (settings?.recordingStreamUrl && recording.audio_url) {
      // Extract the timestamp and parameters from the original URL
      const urlParts = recording.audio_url.split('?');
      if (urlParts.length > 1) {
        // Use the recording stream URL from settings with the same parameters
        audioUrl = `${settings.recordingStreamUrl}?${urlParts[1]}`;
        console.log('Using recording stream URL from settings:', audioUrl);
      }
    }
    
    setCurrentPlayer({
      audioUrl,
      title: recording.title,
      showTitle: recording.shows?.title || 'Unknown Show'
    });
  };

  const closePlayer = () => {
    setCurrentPlayer(null);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (recordedShows.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recordings available</h3>
        <p className="text-muted-foreground">
          Recordings are available for 3 days after each show. Check back after your favorite shows air!
        </p>
      </div>
    );
  }

  // Group recordings by show
  const groupedRecordings = recordedShows.reduce((acc, recording) => {
    const showKey = recording.shows ? 
      `${recording.shows.title} - ${recording.shows.host}` : 
      'Manual Uploads';
    
    if (!acc[showKey]) {
      acc[showKey] = [];
    }
    acc[showKey].push(recording);
    return acc;
  }, {} as Record<string, RecordedShow[]>);

  return (
    <>
      <div className="grid gap-6">
        {Object.entries(groupedRecordings).map(([showKey, recordings]) => (
          <Card key={showKey} className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{showKey}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recordings.map((recording) => (
                  <Card key={recording.id} className="bg-background/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{recording.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(recording.recorded_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      
                      {recording.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {recording.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(recording.duration_seconds)}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => playRecording(recording)}
                          className="h-8"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentPlayer && (
        <CatchUpPlayer
          audioUrl={currentPlayer.audioUrl}
          title={currentPlayer.title}
          showTitle={currentPlayer.showTitle}
          onClose={closePlayer}
        />
      )}
    </>
  );
};