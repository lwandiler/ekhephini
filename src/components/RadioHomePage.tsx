import RadioNavigation from './RadioNavigation';
import RadioHeroSection from './RadioHeroSection';
import RadioPlayerSection from './RadioPlayerSection';
import RadioContentSections from './RadioContentSections';
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

      {/* Presenters & Testimonials */}
      <PresentersTestimonialsSection />

      {/* Newsletter Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default RadioHomePage;
