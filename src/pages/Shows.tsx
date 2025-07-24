// Shows page component
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import ShowSchedule from '@/components/ShowSchedule';
import ShowCard from '@/components/ShowCard';
import AdBanner from '@/components/AdBanner';
import AdRequestModal from '@/components/AdRequestModal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { advertisementData } from '@/data/mockData';

const Shows = () => {
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-green-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Shows</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover our lineup of shows and hosts, bringing you the best in music, talk, and entertainment.
            </p>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* Weekly Schedule */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-green-800">Weekly Schedule</h2>
            <ShowSchedule />
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* Advertise With Us */}
        <section className="bg-green-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Advertise With Us</h2>
            <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
              Reach our engaged audience with your brand. Submit your advertising request and we'll get back to you with our rates and availability.
            </p>
            <AdRequestModal>
              <Button className="bg-white text-green-800 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold text-lg">
                Get Started
              </Button>
            </AdRequestModal>
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