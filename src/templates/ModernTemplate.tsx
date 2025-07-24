
import { Link } from 'react-router-dom';
import ShowCard from '@/components/ShowCard';
import ShowSchedule from '@/components/ShowSchedule';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import NowLive from '@/components/NowLive';
import UpcomingShows from '@/components/UpcomingShows';
import { Button } from '@/components/ui/button';
import NewsletterForm from '@/components/NewsletterForm';
import SocialFeedsSection from '@/components/SocialFeedsSection';
import { Play, Radio, Music, Headphones, Calendar, Mail } from 'lucide-react';

interface ModernTemplateProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  themeOptions?: any;
  onListenLiveClick?: () => void;
  onPlayPodcast?: (podcast: Podcast) => void;
}

const ModernTemplate = ({ 
  featuredShows, 
  featuredNews,
  featuredPodcasts,
  themeOptions,
  onListenLiveClick,
  onPlayPodcast
}: ModernTemplateProps) => {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section - Modern Style with green gradients */}
        <section className="bg-gradient-to-b from-green-900 via-green-800 to-green-700 text-white">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">Experience Click Radio<br/>Like Never Before</h1>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Immerse yourself in captivating shows, podcasts, and music curated just for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full px-8 py-6 flex items-center"
                  onClick={onListenLiveClick}
                >
                  <Play size={24} className="mr-2" fill="currentColor" />
                  Listen Live
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white hover:bg-green-700 hover:text-white rounded-full px-8 py-6 text-white" asChild>
                  <Link to="/shows">
                    Explore Shows
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="h-16 bg-gradient-to-b from-green-700 to-transparent"></div>
        </section>
        
        {/* Now Live Section */}
        <NowLive />
        
        {/* Upcoming Shows */}
        <UpcomingShows />
        
        {/* Weekly Schedule - White Background */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Plan Your Week</span>
              <h2 className="text-4xl font-bold mt-2 text-gray-900">Weekly Schedule</h2>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-green-200">
              <ShowSchedule />
            </div>
          </div>
        </section>
        
        {/* Featured Podcasts - White Background */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Listen Anytime</span>
              <h2 className="text-4xl font-bold mt-2 text-gray-900">Popular Podcasts</h2>
            </div>
            
            {featuredPodcasts.length > 0 ? (
              <>
                <div className="mb-12">
                  <PodcastCard podcast={featuredPodcasts[0]} variant="featured" onPlay={onPlayPodcast} />
                </div>
                
                {featuredPodcasts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPodcasts.slice(1, 4).map(podcast => (
                      <PodcastCard key={podcast.id} podcast={podcast} onPlay={onPlayPodcast} />
                    ))}
                  </div>
                )}
                
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg" className="rounded-full border-2 border-green-500 text-green-600 hover:bg-green-600 hover:text-white px-8" asChild>
                    <Link to="/podcasts">
                      <Headphones className="mr-2" />
                      Browse All Episodes
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Headphones className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Podcasts Available</h3>
                <p className="text-gray-500">Check back later for new podcast episodes.</p>
              </div>
            )}
          </div>
        </section>
        
        
        {/* Ad Banner - Modern Style */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <AdBanner position="top" />
          </div>
        </section>
        {/* News & Podcasts Split - Modern Style */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Latest News</h2>
                  <Button variant="link" className="text-purple-400 hover:text-purple-300" asChild>
                    <Link to="/news">More News →</Link>
                  </Button>
                </div>
                <NewsList news={featuredNews} compact />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Recent Podcasts</h2>
                  <Button variant="link" className="text-purple-400 hover:text-purple-300" asChild>
                    <Link to="/podcasts">More Episodes →</Link>
                  </Button>
                </div>
                <div className="space-y-4">
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
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Feeds Section */}
        <SocialFeedsSection />
        
        {/* Newsletter - Modern Style with green gradient */}
        <section className="py-20 bg-gradient-to-r from-green-800 to-green-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Stay Connected</h2>
              <p className="text-xl text-white/80 mb-8">
                Subscribe to our newsletter for exclusive content, special offers, and updates on your favorite shows and podcasts.
              </p>
              <NewsletterForm variant="modern" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ModernTemplate;
