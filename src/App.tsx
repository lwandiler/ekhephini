
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ShowsPage = lazy(() => import('./pages/Shows'));
const PodcastsPage = lazy(() => import('./pages/Podcasts'));
const NewsPage = lazy(() => import('./pages/News'));
const AnnouncementsPage = lazy(() => import('./pages/Announcements'));
const ChartsPage = lazy(() => import('./pages/Charts'));
const AuthPage = lazy(() => import('./pages/Auth'));
const AdminPage = lazy(() => import('./pages/Admin'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AudioPlayerProvider>
              <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shows" element={<ShowsPage />} />
                  <Route path="/podcasts" element={<PodcastsPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/charts" element={<ChartsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster position="top-center" richColors />
              </Suspense>
            </AudioPlayerProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
