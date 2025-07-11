
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import AdBanner from '@/components/AdBanner';
import { Megaphone, Calendar, Clock } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  important: boolean;
  category: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Station Maintenance Schedule",
    content: "Our station will be undergoing routine maintenance on May 15th from 2:00 AM to 5:00 AM. During this time, our live stream may experience brief interruptions. We apologize for any inconvenience and thank you for your understanding.",
    date: "2025-05-10",
    important: true,
    category: "Technical"
  },
  {
    id: 2,
    title: "Special Guest Announcement: Music Superstar Coming Next Week",
    content: "We're thrilled to announce that international music sensation Taylor Swift will be joining us live in the studio next Wednesday for an exclusive interview and acoustic performance. Tune in at 10:00 AM to catch this special event!",
    date: "2025-05-08",
    important: true,
    category: "Programming"
  },
  {
    id: 3,
    title: "Community Food Drive",
    content: "Radio Wave Hub is partnering with the Local Food Bank for our annual summer food drive. Drop off non-perishable food items at our studio location or any participating grocery stores from May 20th to June 5th. Let's come together to help those in need!",
    date: "2025-05-05",
    important: false,
    category: "Community"
  },
  {
    id: 4,
    title: "Schedule Change Notice",
    content: "Starting June 1st, 'Evening Chill' with Sophia Lee will move to a new timeslot, airing from 9:00 PM to midnight. This adjustment allows us to introduce a new show, 'Underground Beats' with DJ Kris, which will take over the 8:00 PM to 9:00 PM slot.",
    date: "2025-05-01",
    important: false,
    category: "Programming"
  },
  {
    id: 5,
    title: "App Update Available",
    content: "A new version of the Radio Wave Hub mobile app is now available for download. This update includes improved streaming quality, a redesigned user interface, and the ability to save favorite shows for offline listening.",
    date: "2025-04-29",
    important: false,
    category: "Technical"
  }
];

const Announcements = () => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Announcements</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Important updates and announcements from Radio Wave Hub.
            </p>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* Announcements List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className={`border-l-4 ${
                    announcement.important 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-radio-accent bg-gray-50'
                  } rounded-r-lg shadow-sm p-6 hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-radio-blue mb-2 flex items-center">
                      {announcement.important && (
                        <Megaphone size={20} className="inline mr-2 text-red-500" />
                      )}
                      {announcement.title}
                    </h3>
                    <div className="bg-radio-blue/10 px-3 py-1 rounded text-sm">
                      {announcement.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  
                  <p className="text-gray-700">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Submit Announcement */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-radio-blue mb-4">Have an Announcement?</h2>
            <p className="text-gray-600 mb-6">
              If you're a community organization or local business with news to share, submit your announcement for consideration.
            </p>
            <button className="bg-radio-blue hover:bg-radio-light-blue text-white px-6 py-3 rounded-md font-medium">
              Submit an Announcement
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

export default Announcements;
