
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { StationProvider } from '@/contexts/StationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Import pages
import Index from '@/pages/Index';
import Shows from '@/pages/Shows';
import Podcasts from '@/pages/Podcasts';
import News from '@/pages/News';
import Charts from '@/pages/Charts';
import Announcements from '@/pages/Announcements';
import Admin from '@/pages/Admin';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StationProvider>
            <AudioPlayerProvider>
              <Router>
                <GoogleAnalytics />
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/podcasts" element={<Podcasts />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/charts" element={<Charts />} />
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
