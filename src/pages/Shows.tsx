import React from 'react';
import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';
import ShowSchedule from '@/components/ShowSchedule';
import UpcomingShows from '@/components/UpcomingShows';

const Shows = () => {
  return (
    <div className="w-full min-h-screen bg-white font-asap">
      <RadioNavigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Shows</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover your favorite programs and explore our diverse lineup of entertaining and informative shows.
            </p>
          </div>
        </section>

        {/* Show Schedule Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Weekly Schedule</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Check out our complete weekly programming schedule and never miss your favorite shows.
              </p>
            </div>
            <ShowSchedule />
          </div>
        </section>

        {/* Upcoming Shows Section */}
        <UpcomingShows />
      </main>
      
      <NewsletterFooter />
    </div>
  );
};

export default Shows;