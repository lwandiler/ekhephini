
import { Link } from 'react-router-dom';
import ShowSchedule from '@/components/ShowSchedule';
import ShowCard from '@/components/ShowCard';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { Button } from '@/components/ui/button';
import NewsletterForm from '@/components/NewsletterForm';
import { Radio } from 'lucide-react';

interface ClassicTemplateProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  onListenLiveClick?: () => void;
  onPlayPodcast?: (podcast: Podcast) => void;
}

const ClassicTemplate = ({ 
  featuredShows, 
  featuredNews,
  featuredPodcasts,
  onListenLiveClick,
  onPlayPodcast
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
        
        
        {/* Featured Podcasts */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <EditableText 
              contentKey="featured_podcasts_title"
              defaultValue="Featured Podcasts"
              as="h2"
              className="text-3xl font-bold text-purple-300 mb-8"
            />
            {featuredPodcasts.length > 0 ? (
              <>
                <div className="mb-8">
                  <PodcastCard podcast={featuredPodcasts[0]} variant="featured" onPlay={onPlayPodcast} />
                </div>
                {featuredPodcasts.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredPodcasts.slice(1, 4).map(podcast => (
                      <PodcastCard key={podcast.id} podcast={podcast} onPlay={onPlayPodcast} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-gray-600 mb-4 flex items-center justify-center">
                  🎧
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Podcasts Available</h3>
                <p className="text-gray-400">Check back later for new podcast episodes.</p>
              </div>
            )}
            <div className="text-center mt-8">
              <Button variant="outline" className="text-purple-300 border-purple-400 hover:bg-purple-800 hover:text-white" asChild>
                <Link to="/podcasts">View All Podcasts</Link>
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
            <NewsletterForm variant="classic" />
          </div>
        </section>
      </main>
    </>
  );
};

export default ClassicTemplate;
