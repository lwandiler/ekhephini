
import { useState, useEffect, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import SocialChat from '@/components/SocialChat';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import EditModeToggle from '@/components/EditModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import TemplateRenderer from '@/components/TemplateRenderer';
import { useHomeTheme } from '@/hooks/useHomeTheme';
import { featuredShowsData, featuredNewsData, featuredPodcastsData } from '@/data/mockData';
import { Toaster } from 'sonner';
import { useRadioModal } from '@/hooks/useRadioModal';

const HomePage = () => {
  const { themeOptions, handleThemeChange, handleThemeOptionsChange } = useHomeTheme();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [featuredShows, setFeaturedShows] = useState(featuredShowsData);
  const [featuredPodcasts, setFeaturedPodcasts] = useState(featuredPodcastsData);
  const { setModalOpen } = useRadioModal();
  
  // Check if the user is an admin
  useEffect(() => {
    const isAdminUser = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';
    setIsAdmin(!!isAdminUser);
  }, [user]);

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
            featuredNews={featuredNewsData} 
            featuredPodcasts={featuredPodcasts}
            themeOptions={themeOptions}
            onListenLiveClick={handleListenLiveClick}
          />
        </main>
        
        <Footer />
        <RadioPlayer />
        <ChatBot />
        <SocialChat />
        <EditModeToggle />
        <Toaster position="top-center" richColors />
      </div>
    </InlineEditProvider>
  );
};

export default HomePage;
