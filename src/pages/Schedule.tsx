import React from 'react';
import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';
import WeeklyScheduleGrid from '@/components/WeeklyScheduleGrid';

const Schedule = () => {
  return (
    <div className="w-full min-h-screen bg-white font-asap">
      <RadioNavigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#004995] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Program Schedule</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Your complete weekly programming guide. Stay tuned to your favorite shows.
            </p>
          </div>
        </section>

        {/* Weekly Schedule Section */}
        <WeeklyScheduleGrid />
      </main>
      
      <NewsletterFooter />
    </div>
  );
};

export default Schedule;