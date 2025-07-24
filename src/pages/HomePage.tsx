
import { useState, useEffect, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import EditModeToggle from '@/components/EditModeToggle';
import SocialFeedsSection from '@/components/SocialFeedsSection';
import PodcastPlayer from '@/components/PodcastPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import TemplateRenderer from '@/components/TemplateRenderer';
import { useHomeTheme } from '@/hooks/useHomeTheme';
import { featuredShowsData } from '@/data/mockData';
import { podcastsService } from '@/services/api/podcastsService';
import { blogService, BlogPost } from '@/services/api/blogService';
import { Podcast } from '@/components/PodcastCard';
import { Toaster } from 'sonner';
import { useRadioModal } from '@/hooks/useRadioModal';

const HomePage = () => {
  const { themeOptions, handleThemeChange, handleThemeOptionsChange } = useHomeTheme();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [featuredShows, setFeaturedShows] = useState(featuredShowsData);
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [featuredPodcasts, setFeaturedPodcasts] = useState<Podcast[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const { setModalOpen } = useRadioModal();
  
  // Check if the user is an admin
  useEffect(() => {
    const isAdminUser = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';
    setIsAdmin(!!isAdminUser);
  }, [user]);

  // Fetch real news and podcasts from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch podcasts
        const podcasts = await podcastsService.getAllPodcasts();
        const transformedPodcasts = podcasts.map((podcast, index) => ({
          id: index + 1,
          title: podcast.title,
          host: podcast.host,
          description: podcast.description || '',
          image: podcast.image_url || '/placeholder.svg',
          duration: podcast.duration || 'Unknown',
          publishDate: podcast.publish_date,
          episodeNumber: podcast.episode_number || 1,
          listenUrl: podcast.listen_url || '#'
        }));
        setFeaturedPodcasts(transformedPodcasts);

        // Fetch blog posts for news
        const blogPosts = await blogService.getPublishedPosts();
        const transformedNews = blogPosts.map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 200) + '...',
          image: post.featured_image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
          date: post.published_at || post.created_at!,
          author: post.author,
          category: post.category || "News"
        }));
        setFeaturedNews(transformedNews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Force dark mode
  useEffect(() => {
    if (!isDarkMode) {
      toggleDarkMode();
    }
  }, [isDarkMode, toggleDarkMode]);

  const handleListenLiveClick = () => {
    setModalOpen(true);
    // Also trigger play if not already playing
    const radioPlayer = document.querySelector('[data-radio-player]');
    if (radioPlayer) {
      const event = new CustomEvent('triggerPlay');
      radioPlayer.dispatchEvent(event);
    }
  };

  const handlePlayPodcast = (podcast: Podcast) => {
    setCurrentPodcast(podcast);
  };

  const handleClosePodcastPlayer = () => {
    setCurrentPodcast(null);
  };

  return (
    <InlineEditProvider>
      <div className={`flex flex-col min-h-screen font-${themeOptions.fontFamily} text-size-${themeOptions.fontSize} dark`}>
        <Header />
        
        <main className="flex-1 bg-gray-900">
          <div className="w-full">
            <HeroBannerCarousel />
          </div>
          <TemplateRenderer 
            featuredShows={featuredShows} 
            featuredNews={featuredNews} 
            featuredPodcasts={featuredPodcasts}
            themeOptions={themeOptions}
            onListenLiveClick={handleListenLiveClick}
            onPlayPodcast={handlePlayPodcast}
          />
        </main>
        
        <Footer />
        <RadioPlayer />
        <PodcastPlayer 
          currentPodcast={currentPodcast}
          onClose={handleClosePodcastPlayer}
        />
        <EditModeToggle />
        <Toaster position="top-center" richColors />
      </div>
    </InlineEditProvider>
  );
};

export default HomePage;
