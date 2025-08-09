import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Podcast, PlayCircle, ExternalLink, Search, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';

interface PodcastData {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  podcast_link: string;
  created_at: string;
}

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<PodcastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const { data, error } = await supabase
          .from('podcasts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching podcasts:', error);
          return;
        }

        setPodcasts(data || []);
        setFilteredPodcasts(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  useEffect(() => {
    const filtered = podcasts.filter(podcast =>
      podcast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPodcasts(filtered);
  }, [searchTerm, podcasts]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePodcastClick = (podcastLink: string) => {
    window.open(podcastLink, '_blank');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
          <div className="container mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Loading Podcasts...</h1>
              <p className="text-muted-foreground">Please wait while we fetch your podcasts.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-asap">
      {/* Navigation */}
      <RadioNavigation />
      
      {/* Main Content */}
      <div className="bg-gradient-to-b from-background to-muted/20">
        <div className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Podcast className="h-10 w-10 text-primary" />
              All Podcasts
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our complete collection of podcast episodes featuring local stories, community voices, and engaging conversations.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Podcasts Grid */}
          {filteredPodcasts.length === 0 ? (
            <div className="text-center py-12">
              <Podcast className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No Podcasts Found' : 'No Podcasts Yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Check back soon for our latest podcast episodes!'
                }
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPodcasts.map((podcast, index) => (
                <Card 
                  key={podcast.id} 
                  className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => handlePodcastClick(podcast.podcast_link)}
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
          )}

          {/* Results Count */}
          {filteredPodcasts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPodcasts.length} of {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
      
      {/* Newsletter Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default Podcasts;