import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';
import RadioPlayer from '@/components/RadioPlayer';
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
      
      {/* Featured Content Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-4 text-center">
            Recent Episodes
          </h2>
          <p className="text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal mb-16 text-center max-w-3xl mx-auto">
            Listen to the latest episodes from all your favorite shows and discover new content you might have missed.
          </p>
          
          {/* Recent Episodes Grid - Placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((episode) => (
              <div key={episode} className="bg-white rounded-[30px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={`https://images.unsplash.com/photo-${1520000000000 + episode}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                    alt={`Episode ${episode}`}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#F99300] text-white px-3 py-1 rounded-[20px] font-asap text-[12px] font-bold">
                    RECORDED
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-black font-asap text-[24px] font-bold leading-normal mb-2">
                    Episode {episode} - Morning Show
                  </h3>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-2">
                    Host: Sarah Johnson
                  </p>
                  <p className="text-[#5F5F5F] font-asap text-[14px] font-normal leading-normal mb-4">
                    Aired: {new Date(Date.now() - episode * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-6">
                    Great music, interesting discussions, and the latest news to start your day right.
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-black font-asap text-[14px] font-normal leading-normal">Listen Now</span>
                    <svg className="w-3 h-4 rotate-90" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9.13655 11.4911L13.5123 6.70738H1.0198C0.74933 6.70738 0.489941 6.61907 0.298691 6.46189C0.107442 6.3047 -1.26765e-06 6.09152 -1.26765e-06 5.86923C-1.26765e-06 5.64693 0.107442 5.43375 0.298691 5.27656C0.489941 5.11938 0.74933 5.03107 1.0198 5.03107H13.5123L9.13655 1.4333C8.94497 1.27584 8.83734 1.06228 8.83734 0.839607C8.83734 0.61693 8.94497 0.403372 9.13655 0.245915C9.32813 0.0884585 9.58797 2.34629e-09 9.8589 0C10.1298 -2.34629e-09 10.3897 0.0884585 10.5813 0.245915L16.7001 5.27483C16.7951 5.3527 16.8706 5.44523 16.922 5.54711C16.9735 5.64899 17 5.75821 17 5.86853C17 5.97884 16.9735 6.08807 16.922 6.18995C16.8706 6.29183 16.7951 6.38435 16.7001 6.46222L10.5813 11.4911C10.4865 11.5693 10.3739 11.6313 10.25 11.6736C10.126 11.7159 9.99312 11.7377 9.8589 11.7377C9.72468 11.7377 9.59178 11.7159 9.46783 11.6736C9.34387 11.6313 9.23129 11.5693 9.13655 11.4911Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      
      <RadioPlayer />
    </div>
  );
};

export default CatchUp;