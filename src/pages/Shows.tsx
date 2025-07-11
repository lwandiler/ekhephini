
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import ShowSchedule from '@/components/ShowSchedule';
import ShowCard from '@/components/ShowCard';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { advertisementData } from '@/data/mockData';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

const Shows = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const showsList = [
    {
      id: 1,
      title: "Morning Brew",
      host: "Sarah Johnson",
      time: "Weekdays 6:00 AM - 9:00 AM",
      description: "Start your day with upbeat music and interesting discussions.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: true
    },
    {
      id: 2,
      title: "Midday Mix",
      host: "Jason Parker",
      time: "Monday 12:00 PM - 3:00 PM",
      description: "The best mix of today's hits and yesterday's classics.",
      image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: false
    },
    {
      id: 3,
      title: "Jazz Hour",
      host: "Robert Williams",
      time: "Tuesday 1:00 PM - 3:00 PM",
      description: "Two hours of smooth jazz to brighten your afternoon.",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: false
    },
    {
      id: 4,
      title: "Local Spotlight",
      host: "David Chen",
      time: "Wednesday 2:00 PM - 4:00 PM",
      description: "Featuring music and interviews from local artists.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: false
    },
    {
      id: 5,
      title: "Throwback Thursday",
      host: "Emma Wilson",
      time: "Thursday 12:00 PM - 3:00 PM",
      description: "Nothing but classic hits from the 80s, 90s, and 2000s.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: false
    },
    {
      id: 6,
      title: "Weekend Kickoff",
      host: "Alex Turner",
      time: "Friday 4:00 PM - 8:00 PM",
      description: "Get your weekend started with the biggest hits and party favorites.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      isLive: false
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Shows</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover our lineup of shows and hosts, bringing you the best in music, talk, and entertainment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button 
                variant="default" 
                size="lg" 
                className="bg-white text-radio-blue hover:bg-gray-100 font-medium"
              >
                <span className="block">Explore Shows</span>
              </Button>
              <ThemeToggle variant="full" />
            </div>
          </div>
        </section>
        
        {/* Theme Toggle in Floating Button */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* Weekly Schedule */}
        <section className={`py-12 ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-radio-blue'}`}>Weekly Schedule</h2>
            <ShowSchedule />
          </div>
        </section>
        
        {/* All Shows */}
        <section className={`py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-radio-blue'}`}>All Shows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showsList.map(show => (
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
        
        {/* DJ Spotlight */}
        <section className={`py-12 ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Sarah Johnson"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-radio-blue'}`}>DJ Spotlight</h2>
                <h3 className="text-2xl font-semibold mb-2">Sarah Johnson</h3>
                <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-radio-muted'}`}>Host of "Morning Brew"</p>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sarah Johnson has been a beloved voice on Radio Wave Hub for over 5 years. With her energetic personality and exceptional music taste, she helps thousands of listeners start their day on the right note with her popular morning show.
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  When she's not in the studio, Sarah enjoys hiking, photography, and discovering new indie artists to feature on her show. Her infectious laugh and genuine conversations with guests have made "Morning Brew" the most listened-to morning show in the region.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Side by side ads */}
        <section className={`py-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdBanner position="sidebar" />
              <AdBanner position="sidebar" />
            </div>
          </div>
        </section>
        
        {/* Become a Guest */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Be a Guest on Our Shows?</h2>
            <p className="text-xl text-radio-muted mb-6 max-w-2xl mx-auto">
              We're always looking for interesting guests to feature on our shows. If you have a story to tell, music to share, or expertise to offer, we'd love to hear from you.
            </p>
            <button className="bg-radio-accent hover:bg-radio-accent/80 text-white px-6 py-3 rounded-md font-medium">
              Apply to Be a Guest
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
      <RadioPlayer />
      <ChatBot />
    </div>
  );
};

export default Shows;
