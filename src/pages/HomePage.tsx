
import { useState, useEffect, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import SocialChat from '@/components/SocialChat';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import EditModeToggle from '@/components/EditModeToggle';
import VisualEditingWrapper from '@/components/visual-editor/VisualEditingWrapper';
import PodcastPlayer from '@/components/PodcastPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import TemplateRenderer from '@/components/TemplateRenderer';
import { useHomeTheme } from '@/hooks/useHomeTheme';
import { featuredShowsData, featuredNewsData } from '@/data/mockData';
import { podcastsService } from '@/services/api/podcastsService';
import { Podcast } from '@/components/PodcastCard';
import { Toaster } from 'sonner';
import { useRadioModal } from '@/hooks/useRadioModal';

const HomePage = () => {
  const { themeOptions, handleThemeChange, handleThemeOptionsChange } = useHomeTheme();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [featuredShows, setFeaturedShows] = useState(featuredShowsData);
  const [featuredPodcasts, setFeaturedPodcasts] = useState<Podcast[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const { setModalOpen } = useRadioModal();
  
  // Check if the user is an admin
  useEffect(() => {
    const isAdminUser = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';
    setIsAdmin(!!isAdminUser);
  }, [user]);

  // Fetch real podcasts from database
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const podcasts = await podcastsService.getAllPodcasts();
        // Transform database podcasts to match the component interface
        const transformedPodcasts = podcasts.map((podcast, index) => ({
          id: index + 1, // Use index as number ID for component compatibility
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
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        // Keep empty array on error
      }
    };

    fetchPodcasts();
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
        <VisualEditingWrapper>
          <Header />
          
          <main className="flex-1 bg-gray-900">
            <div className="w-full">
              <HeroBannerCarousel />
            </div>
            <TemplateRenderer 
              featuredShows={featuredShows} 
              featuredNews={featuredNewsData}
              featuredPodcasts={featuredPodcasts}
              themeOptions={themeOptions}
              onListenLiveClick={handleListenLiveClick}
              onPlayPodcast={handlePlayPodcast}
            />
          </main>
          
          <Footer />
        </VisualEditingWrapper>
        
        <RadioPlayer />
        <PodcastPlayer 
          currentPodcast={currentPodcast}
          onClose={handleClosePodcastPlayer}
        />
        <ChatBot />
        <SocialChat />
        <EditModeToggle />
        <Toaster position="top-center" richColors />
      </div>
    </InlineEditProvider>
  );
};

export default HomePage;
