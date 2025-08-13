import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Podcast, PlayCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

interface PodcastData {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  podcast_link: string;
  created_at: string;
}

const LatestPodcasts = () => {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { playExternalUrl } = useAudioPlayer();

  useEffect(() => {
    const fetchLatestPodcasts = async () => {
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching podcasts:', error);
          return;
        }

        setPodcasts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchLatestPodcasts();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const handlePodcastClick = (podcastName: string, podcastLink: string, thumbnail?: string | null) => {
  playExternalUrl(podcastName, podcastLink, thumbnail);
};

  const handleExploreMore = () => {
    navigate('/podcasts');
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Podcasts</h2>
            <p className="text-muted-foreground">Loading podcasts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Podcast className="h-8 w-8 text-primary" />
            Latest Podcasts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Catch up on our latest podcast episodes featuring interesting conversations, local stories, and community voices.
          </p>
        </div>

        {podcasts.length === 0 ? (
          <div className="text-center py-12">
            <Podcast className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Podcasts Yet</h3>
            <p className="text-muted-foreground">Check back soon for our latest podcast episodes!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {podcasts.map((podcast, index) => (
<Card 
  key={podcast.id} 
  className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
  onClick={() => handlePodcastClick(podcast.name, podcast.podcast_link, podcast.thumbnail_url)}
>
                  <div className="relative">
                    {podcast.thumbnail_url ? (
                      <img
                        src={podcast.thumbnail_url}
                        alt={podcast.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Podcast className="h-16 w-16 text-primary/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="w-full bg-primary/90 hover:bg-primary">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Listen Now
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        Episode #{podcasts.length - index}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {podcast.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {podcast.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {podcast.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(podcast.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={handleExploreMore}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Podcast className="h-5 w-5 mr-2" />
                Explore More Podcasts
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestPodcasts;