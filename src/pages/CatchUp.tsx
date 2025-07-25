import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import Hls from 'hls.js';

// Extend Window interface for HLS.js
declare global {
  interface Window {
    Hls: typeof Hls;
  }
}

interface RecordedShow {
  id: string;
  title: string;
  description: string | null;
  recorded_at: string;
  audio_url: string;
  duration_seconds: number | null;
  expires_at: string;
  show_id: string | null;
}

export const CatchUp: React.FC = () => {
  const [recordedShows, setRecordedShows] = useState<RecordedShow[]>([]);
  const [showDetails, setShowDetails] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Format time from database format (HH:MM:SS) to display format (H:MM AM/PM)
  const formatTimeRange = (startTime: string, endTime: string): string => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const minute = minutes;
      
      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  useEffect(() => {
    const fetchRecordedShows = async () => {
      try {
        const { data: recordings, error: recordingError } = await supabase
          .from('recorded_shows')
          .select('*')
          .order('recorded_at', { ascending: false });

        if (recordingError) {
          console.error('Error fetching recordings:', recordingError);
          toast.error('Failed to load recordings');
          return;
        }

        // Fetch show details for all recordings
        const showIds = recordings?.map(r => r.show_id).filter(Boolean) || [];
        const { data: shows, error: showError } = await supabase
          .from('shows')
          .select('*')
          .in('id', showIds);

        if (showError) {
          console.error('Error fetching show details:', showError);
        }

        // Create a mapping of show_id to show details with formatted time
        const showMapping = {};
        shows?.forEach(show => {
          showMapping[show.id] = {
            ...show,
            time: formatTimeRange(show.start_time, show.end_time)
          };
        });

        setRecordedShows(recordings || []);
        setShowDetails(showMapping);
      } catch (error) {
        console.error('Error fetching recorded shows:', error);
        toast.error('Failed to load catch up shows');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordedShows();

    // Set up real-time subscription for new recordings
    const channel = supabase
      .channel('recorded_shows_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recorded_shows'
        },
        (payload) => {
          console.log('Recorded show change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.success('New catch-up recording available!');
            // Refresh the data
            fetchRecordedShows();
          } else if (payload.eventType === 'DELETE') {
            // Remove from local state
            setRecordedShows(prev => prev.filter(show => show.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stopPlayback = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(null);
    }
    setCurrentlyPlaying(null);
  };

  const playRecordedShow = (audioUrl: string, showId: string) => {
    console.log('Attempting to play recorded show:', audioUrl);
    console.log('Show ID:', showId);
    
    // If already playing this show, stop it
    if (currentlyPlaying === showId) {
      stopPlayback();
      return;
    }
    
    setCurrentlyPlaying(showId);
    
    // Check if the URL is a placeholder or invalid
    if (audioUrl.includes('example.com')) {
      toast.error('This is a demo recording - audio file not available');
      setCurrentlyPlaying(null);
      return;
    }
    
    // Stop any currently playing audio
    stopPlayback();
    
    // Create new audio element for HLS playback
    const audio = new Audio();
    setAudioElement(audio);
    
    console.log('Using catch-up recording URL:', audioUrl);
    
    // Verify this is a catch-up URL (should contain index- and timestamp)
    if (!audioUrl.includes('/index-')) {
      console.warn('Warning: URL does not appear to be a catch-up recording URL');
      toast.error('Invalid recording URL format');
      setCurrentlyPlaying(null);
      return;
    }
    
    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      console.log('Using HLS.js for playback');
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: false,
      });
      
      hls.loadSource(audioUrl);
      hls.attachMedia(audio);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, attempting to play');
        audio.play().catch((error) => {
          console.error('Error playing HLS audio:', error);
          toast.error('Failed to play recording');
          setCurrentlyPlaying(null);
        });
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          toast.error('Error loading catch-up recording');
          setCurrentlyPlaying(null);
        }
      });
      
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      console.log('Using native HLS support');
      audio.src = audioUrl;
      audio.play().catch((error) => {
        console.error('Error playing native HLS audio:', error);
        toast.error('Failed to play recording');
        setCurrentlyPlaying(null);
      });
    } else {
      console.error('HLS not supported');
      toast.error('HLS playback not supported in this browser');
      setCurrentlyPlaying(null);
      return;
    }
    
    audio.addEventListener('error', (e) => {
      console.error('Audio element error:', e);
      toast.error('Error loading catch-up recording');
      setCurrentlyPlaying(null);
    });
    
    audio.onended = () => {
      console.log('Audio playback ended');
      setCurrentlyPlaying(null);
    };
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown duration';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatRecordedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    if (expiryDate <= now) return 'Expired';
    return formatDistanceToNow(expiryDate, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <RadioPlayer />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Catch Up
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Listen to shows you missed. Recordings are available for 3 days after broadcast.
          </p>
        </div>

        {recordedShows.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No recordings available</h3>
                <p>Check back later for recent show recordings.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {(() => {
              // Group recordings by show
              const groupedRecordings = recordedShows.reduce((acc, recording) => {
                const showId = recording.show_id || 'unknown';
                if (!acc[showId]) {
                  acc[showId] = [];
                }
                acc[showId].push(recording);
                return acc;
              }, {} as Record<string, typeof recordedShows>);

              return Object.entries(groupedRecordings).map(([showId, recordings]) => {
                const show = showDetails[showId];
                // Sort recordings by hour (extract hour number from title)
                const sortedRecordings = recordings.sort((a, b) => {
                  const hourA = parseInt(a.title.match(/Hour (\d+)/)?.[1] || '1');
                  const hourB = parseInt(b.title.match(/Hour (\d+)/)?.[1] || '1');
                  return hourA - hourB;
                });

                return (
                  <Card key={showId} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {show?.image_url && (
                          <img 
                            src={show.image_url} 
                            alt={show.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-xl">
                            {show?.title || 'Unknown Show'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Hosted by {show?.host || 'Unknown Host'}
                          </p>
                          {show && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {show.time} • {show.day_of_week}
                            </p>
                          )}
                          {show?.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {show.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Available Recordings:</h4>
                        {sortedRecordings.map((recording) => {
                          const isPlaying = currentlyPlaying === recording.id;
                          return (
                            <div key={recording.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{recording.title}</h5>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span>Recorded: {format(new Date(recording.recorded_at), 'MMM dd, yyyy')}</span>
                                  <span>{formatDuration(recording.duration_seconds || 0)}</span>
                                  <span>Expires: {getTimeUntilExpiry(recording.expires_at)}</span>
                                </div>
                              </div>
                              <Button
                                variant={isPlaying ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => playRecordedShow(recording.audio_url, recording.id)}
                                className="ml-3"
                              >
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                <span className="ml-1">{isPlaying ? "Stop" : "Play"}</span>
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        )}
      </main>

      <RadioPlayer />
      <Footer />
    </div>
  );
};