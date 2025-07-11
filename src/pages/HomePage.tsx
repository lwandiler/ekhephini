
import { useState, useEffect, useContext } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import SocialChat from '@/components/SocialChat';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import TemplateRenderer from '@/components/TemplateRenderer';
import { useHomeTheme } from '@/hooks/useHomeTheme';
import { featuredShowsData, featuredNewsData, featuredPodcastsData } from '@/data/mockData';
import { Toaster } from 'sonner'; // Use sonner's Toaster directly
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
  };

  return (
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
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default HomePage;
