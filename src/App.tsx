import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { StationProvider } from '@/contexts/StationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { useAnalyticsTracking } from '@/hooks/useAnalytics';

// Import pages
import Index from '@/pages/Index';
import Shows from '@/pages/Shows';
import Podcasts from '@/pages/Podcasts';
import News from '@/pages/News';
import BlogPost from '@/pages/BlogPost';

import Announcements from '@/pages/Announcements';
import Admin from '@/pages/Admin';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import CatchUp from '@/pages/CatchUp';
import Contact from '@/pages/Contact';

import './App.css';

const queryClient = new QueryClient();

// Analytics tracking component
function AnalyticsTracker() {
  const location = useLocation();
  const { trackPageView } = useAnalyticsTracking();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
    console.log('Page view tracked:', location.pathname);
  }, [location, trackPageView]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StationProvider>
            <AudioPlayerProvider>
              <Router>
                <AnalyticsTracker />
                <GoogleAnalytics />
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/podcasts" element={<Podcasts />} />
                    <Route path="/catch-up" element={<CatchUp />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </AudioPlayerProvider>
          </StationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
