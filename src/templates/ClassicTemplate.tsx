
import ShowSchedule from '@/components/ShowSchedule';
import ShowCard from '@/components/ShowCard';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
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
                <EditableText 
                  contentKey="hero_title"
                  defaultValue="Welcome to Click Radio"
                  as="h1"
                  className="text-4xl md:text-5xl font-bold mb-4"
                />
                <EditableText 
                  contentKey="hero_description"
                  defaultValue="Listen to the best music, engaging talk shows, and stay updated with the latest news."
                  className="text-xl text-purple-200 mb-6"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-md font-medium"
                    onClick={onListenLiveClick}
                  >
                    Listen Live
                  </Button>
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
            <EditableText 
              contentKey="featured_shows_title"
              defaultValue="Featured Shows"
              as="h2"
              className="text-3xl font-bold text-purple-300 mb-8"
            />
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
            <EditableText 
              contentKey="featured_podcasts_title"
              defaultValue="Featured Podcasts"
              as="h2"
              className="text-3xl font-bold text-purple-300 mb-8"
            />
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
            <EditableText 
              contentKey="schedule_title"
              defaultValue="Our Schedule"
              as="h2"
              className="text-3xl font-bold text-purple-300 mb-8"
            />
            <ShowSchedule />
          </div>
        </section>
        
        {/* News and Ad Banner Split */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <EditableText 
                  contentKey="latest_news_title"
                  defaultValue="Latest News"
                  as="h2"
                  className="text-3xl font-bold text-purple-300 mb-8"
                />
                <NewsList news={featuredNews} compact />
              </div>
              <div className="lg:w-1/3">
                <EditableText 
                  contentKey="sponsors_title"
                  defaultValue="Sponsors"
                  as="h2"
                  className="text-3xl font-bold text-purple-300 mb-8"
                />
                <AdBanner position="sidebar" />
                <AdBanner position="sidebar" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <EditableText 
              contentKey="cta_title"
              defaultValue="Join Our Community"
              as="h2"
              className="text-3xl font-bold mb-4"
            />
            <EditableText 
              contentKey="cta_description"
              defaultValue="Stay updated with our latest shows, events, and exclusive content by subscribing to our newsletter."
              className="text-xl text-purple-200 mb-6 max-w-2xl mx-auto"
            />
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
