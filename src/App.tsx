import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { StationProvider } from '@/contexts/StationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ProtectedRoute from '@/components/ProtectedRoute';
// Import pages
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import CatchUp from '@/pages/CatchUp';
import Contact from '@/pages/Contact';
import Shows from '@/pages/Shows';
import Podcasts from '@/pages/Podcasts';
import About from '@/pages/About';


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
                    <Route path="/about" element={<About />} />
                    <Route path="/shows" element={<Shows />} />
                    <Route path="/podcasts" element={<Podcasts />} />
                    <Route path="/catch-up" element={<CatchUp />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
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
