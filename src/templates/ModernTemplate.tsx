
import ShowCard from '@/components/ShowCard';
import ShowSchedule from '@/components/ShowSchedule';
import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import { Button } from '@/components/ui/button';
import { Play, Radio, Music, Headphones, Calendar, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModernTemplateProps {
  featuredShows: any[];
  featuredNews: any[];
  featuredPodcasts: Podcast[];
  themeOptions?: any;
  onListenLiveClick?: () => void;
}

const ModernTemplate = ({ 
  featuredShows, 
  featuredNews,
  featuredPodcasts,
  themeOptions,
  onListenLiveClick
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
                <Button size="lg" variant="outline" className="border-2 border-white hover:bg-green-600 hover:text-white rounded-full px-8 py-6 text-white" asChild>
                  <Link to="/shows">
                    Explore Shows
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="h-16 bg-gradient-to-b from-green-700 to-transparent"></div>
        </section>
        
        {/* Featured Podcasts - Modern Style */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">Listen Anytime</span>
              <h2 className="text-4xl font-bold mt-2 text-white">Popular Podcasts</h2>
            </div>
            
            <div className="mb-12">
              <PodcastCard podcast={featuredPodcasts[0]} variant="featured" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPodcasts.slice(1, 4).map(podcast => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-purple-500 text-purple-400 hover:bg-purple-900 hover:text-white px-8">
                <Headphones className="mr-2" />
                Browse All Episodes
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Shows - Modern Split Style */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div>
                <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">What's Playing</span>
                <h2 className="text-4xl font-bold mt-2 text-white">Featured Shows</h2>
              </div>
              <Button variant="link" className="text-purple-400 hover:text-purple-300 mt-4 md:mt-0">
                View All Shows →
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredShows.map(show => (
                <ShowCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  host={show.host}
                  time={show.time}
                  description={show.description}
                  image={show.image === "/placeholder.svg" ? 
                    `https://images.unsplash.com/photo-${1500000000000 + show.id * 1111}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80` : 
                    show.image}
                  isLive={show.isLive}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Ad Banner - Modern Style */}
        <section className="py-12 bg-black">
          <div className="container mx-auto px-4">
            <AdBanner position="top" />
          </div>
        </section>
        
        {/* Weekly Schedule - Modern Style */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">Plan Your Week</span>
              <h2 className="text-4xl font-bold mt-2 text-white">Weekly Schedule</h2>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-purple-900/50">
              <ShowSchedule />
            </div>
            <div className="mt-10 text-center">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-purple-500 text-purple-400 hover:bg-purple-900 hover:text-white px-8">
                <Calendar className="mr-2" />
                View Full Schedule
              </Button>
            </div>
          </div>
        </section>
        
        {/* News & Podcasts Split - Modern Style */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Latest News</h2>
                  <Button variant="link" className="text-purple-400 hover:text-purple-300">
                    More News →
                  </Button>
                </div>
                <NewsList news={featuredNews} compact />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white">Recent Podcasts</h2>
                  <Button variant="link" className="text-purple-400 hover:text-purple-300">
                    More Episodes →
                  </Button>
                </div>
                <div className="space-y-4">
                  {featuredPodcasts.slice(0, 3).map(podcast => (
                    <PodcastCard key={podcast.id} podcast={podcast} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter - Modern Style with green gradient */}
        <section className="py-20 bg-gradient-to-r from-green-800 to-green-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">Stay Connected</h2>
              <p className="text-xl text-white/80 mb-8">
                Subscribe to our newsletter for exclusive content, special offers, and updates on your favorite shows and podcasts.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-6 py-4 rounded-full flex-1 bg-white/10 border border-green-400/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full px-8 py-4">
                  <Mail className="mr-2" />
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

export default ModernTemplate;
