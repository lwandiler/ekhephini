
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';

import PodcastCard from '@/components/PodcastCard';
import PodcastPlayer from '@/components/PodcastPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { podcastsService, type Podcast as DatabasePodcast } from '@/services/api/podcastsService';

// Transform database podcast to component podcast format
const transformPodcast = (dbPodcast: DatabasePodcast) => ({
  id: parseInt(dbPodcast.id) || Math.random(), // Convert UUID to number for compatibility
  title: dbPodcast.title,
  host: dbPodcast.host,
  description: dbPodcast.description || '',
  image: dbPodcast.image_url || '/placeholder.svg',
  duration: dbPodcast.duration || '0 min',
  publishDate: dbPodcast.publish_date,
  episodeNumber: dbPodcast.episode_number || 1,
  listenUrl: dbPodcast.listen_url || '#'
});

const Podcasts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [podcasts, setPodcasts] = useState<ReturnType<typeof transformPodcast>[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPodcast, setCurrentPodcast] = useState<ReturnType<typeof transformPodcast> | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<ReturnType<typeof transformPodcast>[]>([]);
  
  useEffect(() => {
    fetchPodcasts();
    loadRecentlyPlayed();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const data = await podcastsService.getAllPodcasts();
      const transformedPodcasts = data.map(transformPodcast);
      setPodcasts(transformedPodcasts);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load podcasts. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyPlayed = () => {
    const stored = localStorage.getItem('recentlyPlayedPodcasts');
    if (stored) {
      setRecentlyPlayed(JSON.parse(stored));
    }
  };

  const addToRecentlyPlayed = (podcast: ReturnType<typeof transformPodcast>) => {
    const updated = [podcast, ...recentlyPlayed.filter(p => p.id !== podcast.id)].slice(0, 6);
    setRecentlyPlayed(updated);
    localStorage.setItem('recentlyPlayedPodcasts', JSON.stringify(updated));
  };

  const handlePlayPodcast = (podcast: ReturnType<typeof transformPodcast>) => {
    setCurrentPodcast(podcast);
    addToRecentlyPlayed(podcast);
  };

  const handleClosePodcastPlayer = () => {
    setCurrentPodcast(null);
  };
  
  // Filter podcasts based on search query
  const filteredPodcasts = searchQuery 
    ? podcasts.filter(podcast => 
        podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : podcasts;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-radio-accent mb-4 mx-auto"></div>
            <p className="text-gray-600">Loading podcasts...</p>
          </div>
        </main>
        <Footer />
        <RadioPlayer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Our Podcasts</h1>
            <p className="text-xl max-w-2xl">
              Listen to our collection of podcasts covering music, culture, technology, and more. Available on-demand, anytime.
            </p>
          </div>
        </section>
        
        {/* Search and Filter */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search podcasts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-radio-blue border-radio-blue">
                  Most Recent
                </Button>
                <Button variant="outline" className="text-radio-blue border-radio-blue">
                  Most Popular
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* All Podcasts */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-radio-blue mb-8">All Podcasts</h2>
            {filteredPodcasts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPodcasts.map(podcast => (
                  <PodcastCard 
                    key={podcast.id} 
                    podcast={podcast} 
                    onPlay={handlePlayPodcast}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">
                  {searchQuery ? 'No podcasts found matching your search.' : 'No podcasts available yet.'}
                </p>
                {searchQuery && (
                  <Button variant="link" className="text-radio-blue mt-4" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Recently Played Section */}
        {recentlyPlayed.length > 0 && (
          <section className="py-12 bg-radio-blue text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Recently Played</h2>
              <p className="text-xl text-radio-muted mb-6 max-w-2xl mx-auto">
                Continue listening to your recently played episodes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyPlayed.map(podcast => (
                  <PodcastCard 
                    key={`recent-${podcast.id}`} 
                    podcast={podcast} 
                    variant="compact"
                    onPlay={handlePlayPodcast}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      <RadioPlayer />
      
      
      {/* Podcast Player */}
      <PodcastPlayer 
        currentPodcast={currentPodcast}
        onClose={handleClosePodcastPlayer}
      />
    </div>
  );
};

export default Podcasts;
