import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface RecordedShow {
  id: string;
  title: string;
  description: string | null;
  recorded_at: string;
  audio_url: string;
  duration_seconds: number | null;
  expires_at: string;
  shows?: {
    host: string;
    image_url: string | null;
  } | null;
}

export const CatchUp: React.FC = () => {
  const [recordedShows, setRecordedShows] = useState<RecordedShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    fetchRecordedShows();
  }, []);

  const fetchRecordedShows = async () => {
    try {
      const { data, error } = await supabase
        .from('recorded_shows')
        .select(`
          *,
          shows (
            host,
            image_url
          )
        `)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setRecordedShows(data || []);
    } catch (error) {
      console.error('Error fetching recorded shows:', error);
      toast.error('Failed to load catch up shows');
    } finally {
      setLoading(false);
    }
  };

  const playRecordedShow = (audioUrl: string, showId: string) => {
    setCurrentlyPlaying(showId);
    // Create audio element and play
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      toast.error('Failed to play recording');
      setCurrentlyPlaying(null);
    });

    audio.onended = () => setCurrentlyPlaying(null);
    audio.onerror = () => {
      toast.error('Error playing audio file');
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
          <div className="grid gap-6">
            {recordedShows.map((show) => (
              <Card key={show.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground mb-2">
                        {show.title}
                      </CardTitle>
                      {show.shows?.host && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Hosted by {show.shows.host}
                        </p>
                      )}
                      {show.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {show.description}
                        </p>
                      )}
                    </div>
                    {show.shows?.image_url && (
                      <img
                        src={show.shows.image_url}
                        alt={show.title}
                        className="w-16 h-16 rounded-lg object-cover ml-4"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatRecordedDate(show.recorded_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(show.duration_seconds)}
                      </div>
                      <div className="text-primary font-medium">
                        Expires {getTimeUntilExpiry(show.expires_at)}
                      </div>
                    </div>
                    <Button
                      onClick={() => playRecordedShow(show.audio_url, show.id)}
                      disabled={currentlyPlaying === show.id}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {currentlyPlaying === show.id ? 'Playing...' : 'Play'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <RadioPlayer />
      <Footer />
    </div>
  );
};