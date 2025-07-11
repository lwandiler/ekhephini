
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import PodcastCard, { Podcast } from '@/components/PodcastCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Podcasts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample podcasts data
  const podcastsData: Podcast[] = [
    {
      id: 1,
      title: "Behind the Music",
      host: "James Wilson",
      description: "An in-depth look at the stories behind your favorite songs and the artists who created them.",
      image: "/placeholder.svg",
      duration: "45 min",
      publishDate: "2025-05-01",
      episodeNumber: 42,
      listenUrl: "/podcasts/behind-the-music/42"
    },
    {
      id: 2,
      title: "Tech Talk Radio",
      host: "Emily Chen",
      description: "Stay up-to-date with the latest tech news and trends in this weekly tech podcast.",
      image: "/placeholder.svg",
      duration: "38 min",
      publishDate: "2025-04-28",
      episodeNumber: 156,
      listenUrl: "/podcasts/tech-talk-radio/156"
    },
    {
      id: 3,
      title: "The Film Review",
      host: "Michael Scott",
      description: "Film critics discuss and review the latest movies hitting theaters and streaming services.",
      image: "/placeholder.svg",
      duration: "52 min",
      publishDate: "2025-04-25",
      episodeNumber: 89,
      listenUrl: "/podcasts/film-review/89"
    },
    {
      id: 4,
      title: "Health & Wellness Hour",
      host: "Dr. Sarah Thompson",
      description: "Expert advice on health topics, wellness practices, and living your best life.",
      image: "/placeholder.svg",
      duration: "41 min",
      publishDate: "2025-04-22",
      episodeNumber: 65,
      listenUrl: "/podcasts/health-wellness/65"
    },
    {
      id: 5,
      title: "True Crime Stories",
      host: "Detective Mark Johnson",
      description: "Dive into fascinating real-life mysteries and criminal cases with expert analysis.",
      image: "/placeholder.svg",
      duration: "58 min",
      publishDate: "2025-04-19",
      episodeNumber: 27,
      listenUrl: "/podcasts/true-crime/27"
    },
    {
      id: 6,
      title: "Business Insights",
      host: "Rachel Green",
      description: "Interviews with entrepreneurs and business leaders sharing their insights and experiences.",
      image: "/placeholder.svg",
      duration: "47 min",
      publishDate: "2025-04-15",
      episodeNumber: 112,
      listenUrl: "/podcasts/business-insights/112"
    },
    {
      id: 7,
      title: "Science Today",
      host: "Dr. Alex Murray",
      description: "Breaking down complex scientific topics and discoveries in an accessible way.",
      image: "/placeholder.svg",
      duration: "36 min",
      publishDate: "2025-04-12",
      episodeNumber: 78,
      listenUrl: "/podcasts/science-today/78"
    },
    {
      id: 8,
      title: "Sports Talk",
      host: "Mike Johnson & Tom Wilson",
      description: "In-depth analysis of recent games, player performance, and sports news.",
      image: "/placeholder.svg",
      duration: "63 min",
      publishDate: "2025-04-08",
      episodeNumber: 205,
      listenUrl: "/podcasts/sports-talk/205"
    }
  ];
  
  // Filter podcasts based on search query
  const filteredPodcasts = searchQuery 
    ? podcastsData.filter(podcast => 
        podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : podcastsData;

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
        
        {/* Featured Podcast */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-radio-blue mb-8">Featured Podcast</h2>
            <PodcastCard podcast={podcastsData[0]} variant="featured" />
          </div>
        </section>
        
        {/* All Podcasts */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-radio-blue mb-8">All Podcasts</h2>
            {filteredPodcasts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPodcasts.slice(1).map(podcast => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No podcasts found matching your search.</p>
                <Button variant="link" className="text-radio-blue mt-4" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Subscribe CTA */}
        <section className="py-12 bg-radio-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Never Miss an Episode</h2>
            <p className="text-xl text-radio-muted mb-6 max-w-2xl mx-auto">
              Subscribe to our podcast feed and get notified when new episodes are released.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-radio-blue hover:bg-gray-100">
                Apple Podcasts
              </Button>
              <Button className="bg-white text-radio-blue hover:bg-gray-100">
                Spotify
              </Button>
              <Button className="bg-white text-radio-blue hover:bg-gray-100">
                Google Podcasts
              </Button>
              <Button className="bg-white text-radio-blue hover:bg-gray-100">
                RSS Feed
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <RadioPlayer />
      <ChatBot />
    </div>
  );
};

export default Podcasts;
