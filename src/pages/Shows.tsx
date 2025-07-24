
import { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Shows = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website_url: '',
    ad_type: '',
    budget_range: '',
    preferred_duration: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('ad_requests')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your ad request has been submitted. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        website_url: '',
        ad_type: '',
        budget_range: '',
        preferred_duration: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting ad request:', error);
      toast({
        title: "Error",
        description: "Failed to submit ad request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Advertise With Us</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Reach our engaged audience with your brand. Submit your advertising request and we'll get back to you with our rates and availability.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Company Name *</label>
                    <input 
                      type="text" 
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Contact Name *</label>
                    <input 
                      type="text" 
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Website URL</label>
                  <input 
                    type="url" 
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Ad Type *</label>
                    <select 
                      name="ad_type"
                      value={formData.ad_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50" 
                      required
                    >
                      <option value="">Select ad type</option>
                      <option value="banner">Banner Ad</option>
                      <option value="sidebar">Sidebar Ad</option>
                      <option value="sponsored">Sponsored Content</option>
                      <option value="audio">Audio Spot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Budget Range</label>
                    <select 
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="over-5000">Over $5,000</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Preferred Duration</label>
                  <select 
                    name="preferred_duration"
                    value={formData.preferred_duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select duration</option>
                    <option value="1-week">1 Week</option>
                    <option value="2-weeks">2 Weeks</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tell us about your advertising goals and any specific requirements..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-green-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-200"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ad Request'}
                  </button>
                </div>
              </form>
            </div>
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
