import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';

import ShowSchedule from '@/components/ShowSchedule';
import PresentersTestimonialsSection from '@/components/PresentersTestimonialsSection';

const CatchUp = () => {
  return (
    <div className="w-full min-h-screen bg-white font-asap">
      {/* Navigation */}
      <RadioNavigation />
      
      {/* Hero Section */}
      <section className="relative w-full h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/e154fb9d1aed06944969aa7592132dfc209c4bc2?width=2928"
          alt="Catch Up Background"
          className="absolute -left-3 top-0 w-full h-full object-cover backdrop-blur-[50px]"
        />

        {/* Blue Gradient Overlay */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-[#004995] opacity-78 backdrop-blur-[50px]"></div>

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:px-[185px] py-8 md:py-16 lg:py-24 h-full flex flex-col justify-center">
          <h1 className="max-w-[600px] text-white font-asap text-4xl md:text-6xl lg:text-7xl xl:text-[72px] font-bold leading-normal mb-6">
            Catch Up
          </h1>
          <p className="max-w-[575px] text-white font-asap text-lg md:text-xl lg:text-2xl xl:text-[20px] font-normal leading-normal">
            Missed your favorite show? No worries! Listen to previous episodes and catch up on all the content you love from our talented presenters.
          </p>
        </div>
      </section>
      
      
      {/* Weekly Schedule Section */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-4 text-center">
            Weekly Schedule
          </h2>
          <p className="text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal mb-12 text-center">
            Plan your listening with our complete weekly programming schedule.
          </p>
          <ShowSchedule />
        </div>
      </section>

      {/* Presenters & Testimonials */}
      <PresentersTestimonialsSection />
      
      {/* Newsletter Footer */}
      <NewsletterFooter />
      
    </div>
  );
};

export default CatchUp;