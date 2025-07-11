
import ShowSchedule from '@/components/ShowSchedule';
import ShowCard from '@/components/ShowCard';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import { Button } from '@/components/ui/button';
import { Radio } from 'lucide-react';

interface ClassicTemplateProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  onListenLiveClick?: () => void;
}

const ClassicTemplate = ({ 
  featuredShows, 
  featuredNews,
  featuredPodcasts,
  onListenLiveClick
}: ClassicTemplateProps) => {
  return (
    <>
      <main className="flex-1 bg-gray-900 text-gray-100">
        {/* Hero Section with Black Background */}
        <section className="bg-black text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Click Radio</h1>
                <p className="text-xl text-purple-200 mb-6">
                  Listen to the best music, engaging talk shows, and stay updated with the latest news.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-md font-medium"
                    onClick={onListenLiveClick}
                  >
                    Listen Live
                  </Button>
                  {/* View Schedule button has been removed */}
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-purple-400/40 animate-pulse animation-delay-200"></div>
                  <div className="absolute inset-8 rounded-full bg-purple-400/60 animate-pulse animation-delay-400"></div>
                  <div className="absolute inset-16 rounded-full bg-purple-500 flex items-center justify-center">
                    <Radio size={32} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* Featured Shows */}
        <section className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-purple-300 mb-8">Featured Shows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShows.map(show => (
                <ShowCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  host={show.host}
                  time={show.time}
                  description={show.description}
                  image={show.image}
                  isLive={show.isLive}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Podcasts */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-purple-300 mb-8">Featured Podcasts</h2>
            <div className="mb-8">
              <PodcastCard podcast={featuredPodcasts[0]} variant="featured" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPodcasts.slice(1, 4).map(podcast => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" className="text-purple-300 border-purple-400 hover:bg-purple-800 hover:text-white">
                View All Podcasts
              </Button>
            </div>
          </div>
        </section>
        
        {/* Schedule */}
        <section className="py-12 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-purple-300 mb-8">Our Schedule</h2>
            <ShowSchedule />
          </div>
        </section>
        
        {/* News and Ad Banner Split */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-purple-300 mb-8">Latest News</h2>
                <NewsList news={featuredNews} compact />
              </div>
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-bold text-purple-300 mb-8">Sponsors</h2>
                <AdBanner position="sidebar" />
                <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-purple-200 mb-6 max-w-2xl mx-auto">
              Stay updated with our latest shows, events, and exclusive content by subscribing to our newsletter.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md flex-1 text-gray-800 bg-gray-100 border border-purple-400"
              />
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-md font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ClassicTemplate;
