import ShowCard from '@/components/ShowCard';
import ShowSchedule from '@/components/ShowSchedule';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import { Button } from '@/components/ui/button';
import { Play, Radio, Headphones } from 'lucide-react';

interface MinimalistTemplateProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  themeOptions?: any;
  onListenLiveClick?: () => void;
  onPlayPodcast?: (podcast: Podcast) => void;
}

const MinimalistTemplate = ({ 
  featuredShows, 
  featuredNews,
  featuredPodcasts,
  themeOptions,
  onListenLiveClick,
  onPlayPodcast
}: MinimalistTemplateProps) => {
  return (
    <>
      <main className="flex-1 bg-gray-950">
        {/* Hero Section - Minimalist Style */}
        <section className="bg-black text-white py-24 md:py-32 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-300">Click Radio that speaks to you.</h1>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl">
                Authentic voices. Thoughtful content. The soundtrack to your day.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 py-6 px-8 flex items-center gap-2"
                  onClick={onListenLiveClick}
                >
                  <Play size={20} fill="currentColor" />
                  Listen Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black py-6 px-8">
                  <Radio size={20} className="mr-2" />
                  Browse Shows
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Podcasts - Minimalist Style */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-white border-b border-gray-800 pb-4">Featured Podcasts</h2>
            
            {featuredPodcasts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
                  <PodcastCard podcast={featuredPodcasts[0]} onPlay={onPlayPodcast} />
                  {featuredPodcasts.length > 1 && (
                    <PodcastCard podcast={featuredPodcasts[1]} onPlay={onPlayPodcast} />
                  )}
                </div>
                
                {featuredPodcasts.length > 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPodcasts.slice(2, 5).map(podcast => (
                      <PodcastCard key={podcast.id} podcast={podcast} variant="compact" onPlay={onPlayPodcast} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-gray-600 mb-4 flex items-center justify-center text-3xl">
                  🎧
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Podcasts Available</h3>
                <p className="text-gray-400">Check back later for new podcast episodes.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Divider */}
        <div className="container mx-auto px-4">
          <hr className="border-gray-800" />
        </div>
        
        
        {/* Ad Banner - Minimalist Style */}
        <div className="container mx-auto px-4 py-8 bg-black">
          <AdBanner position="top" />
        </div>
        
        {/* Schedule - Minimalist Style */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-white border-b border-gray-800 pb-4">Weekly Schedule</h2>
            <div className="rounded-lg overflow-hidden border border-gray-800">
              <ShowSchedule />
            </div>
          </div>
        </section>
        
        {/* News - Minimalist Style */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-12 text-white border-b border-gray-800 pb-4">Latest News</h2>
                <NewsList news={featuredNews} />
              </div>
              
              <div className="md:w-1/3">
                <h2 className="text-3xl font-bold mb-8 text-white border-b border-gray-800 pb-4">Recent Episodes</h2>
                <div className="space-y-6">
                  {featuredPodcasts.length > 0 ? (
                    featuredPodcasts.slice(0, 3).map(podcast => (
                      <PodcastCard key={podcast.id} podcast={podcast} variant="compact" onPlay={onPlayPodcast} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No recent episodes available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 text-white">Sponsors</h3>
                  <AdBanner position="sidebar" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter - Minimalist Style */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-4">Newsletter</h2>
              <p className="mb-8 text-gray-400">
                Get weekly updates about new shows, podcasts, and special events directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-none flex-1 focus:outline-none focus:ring-1 focus:ring-white"
                />
                <Button className="bg-white text-black hover:bg-gray-300 rounded-none px-8">
                  <Headphones size={18} className="mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MinimalistTemplate;
