
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';

import AdBanner from '@/components/AdBanner';
import { Megaphone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('active', true)
          .order('date', { ascending: false });

        if (error) {
          console.error('Error fetching announcements:', error);
        } else {
          setAnnouncements(data || []);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <section className="bg-radio-blue text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Announcements</h1>
              <p className="text-xl max-w-2xl mx-auto">
                Important updates and announcements from Radio Wave Hub.
              </p>
            </div>
          </section>
          <AdBanner position="top" />
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">Loading announcements...</div>
            </div>
          </section>
        </main>
        <Footer />
        <RadioPlayer />
      </div>
    );
  }

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
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No announcements at this time.</p>
              </div>
            ) : (
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
                      {announcement.category && (
                        <div className="bg-radio-blue/10 px-3 py-1 rounded text-sm">
                          {announcement.category}
                        </div>
                      )}
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
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      <RadioPlayer />
      
    </div>
  );
};

export default Announcements;
