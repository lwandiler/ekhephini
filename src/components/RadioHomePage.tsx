import RadioNavigation from './RadioNavigation';
import RadioHeroSection from './RadioHeroSection';
import RadioPlayerSection from './RadioPlayerSection';
import RadioContentSections from './RadioContentSections';
import ShowScheduleSection from './ShowScheduleSection';
import WeeklyScheduleGrid from './WeeklyScheduleGrid';
import LatestPodcasts from './LatestPodcasts';
import PresentersTestimonialsSection from './PresentersTestimonialsSection';
import NewsletterFooter from './NewsletterFooter';

const RadioHomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white font-asap">
      {/* Navigation */}
      <RadioNavigation />

      {/* Hero Section */}
      <RadioHeroSection />

      {/* Radio Player Section */}
      <RadioPlayerSection />

      {/* Content Sections */}
      <RadioContentSections />

      {/* Show Schedule Section */}
      <ShowScheduleSection />

      {/* Weekly Schedule Grid */}
      <WeeklyScheduleGrid />

      {/* Latest Podcasts */}
      <LatestPodcasts />

      {/* Presenters & Testimonials */}
      <PresentersTestimonialsSection />

      {/* Newsletter Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default RadioHomePage;
