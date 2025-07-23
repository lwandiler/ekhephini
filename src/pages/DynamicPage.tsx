import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';
import ChatBot from '@/components/ChatBot';
import SocialChat from '@/components/SocialChat';
import EditModeToggle from '@/components/EditModeToggle';
import VisualEditor from '@/components/visual-editor/VisualEditor';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import { pagesService, Page } from '@/services/api/pagesService';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user && sessionStorage.getItem('radioAdminLoggedIn') === 'true';

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        let pageData: Page;
        
        // If admin, allow viewing unpublished pages
        if (isAdmin) {
          // For admin, we'll fetch from all pages
          const allPages = await pagesService.getAllPages();
          const foundPage = allPages.find(p => p.slug === slug);
          if (!foundPage) {
            throw new Error('Page not found');
          }
          pageData = foundPage;
        } else {
          // For regular users, only fetch published pages
          pageData = await pagesService.getPageBySlug(slug);
        }
        
        setPage(pageData);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, navigate, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen dark">
        <Header />
        <main className="flex-1 bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="w-1/2 h-8 mb-4 bg-gray-700 animate-pulse rounded" />
            <div className="w-full h-4 mb-2 bg-gray-700 animate-pulse rounded" />
            <div className="w-full h-4 mb-2 bg-gray-700 animate-pulse rounded" />
            <div className="w-3/4 h-4 mb-8 bg-gray-700 animate-pulse rounded" />
            <div className="w-full h-64 bg-gray-700 animate-pulse rounded" />
          </div>
        </main>
        <Footer />
        <RadioPlayer />
        <ChatBot />
        <SocialChat />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex flex-col min-h-screen dark">
        <Header />
        <main className="flex-1 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg mb-4">{error || 'Page not found'}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
        <RadioPlayer />
        <ChatBot />
        <SocialChat />
      </div>
    );
  }

  return (
    <InlineEditProvider>
      <div className="flex flex-col min-h-screen dark">
        <VisualEditor>
          <Header />
          
          <main className="flex-1 bg-gray-900">
            <div className="container mx-auto px-4 py-8">
              {/* Page Header */}
              <div className="mb-8">
                {page.featured_image && (
                  <div className="mb-6">
                    <EditableImage
                      contentKey={`page-${page.id}-featured-image`}
                      defaultSrc={page.featured_image}
                      alt={page.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <EditableText
                  contentKey={`page-${page.id}-title`}
                  defaultValue={page.title}
                  as="h1"
                  className="text-4xl font-bold text-white mb-4"
                />
                
                {page.excerpt && (
                  <EditableText
                    contentKey={`page-${page.id}-excerpt`}
                    defaultValue={page.excerpt}
                    as="p"
                    className="text-xl text-gray-300 mb-6"
                  />
                )}
              </div>

              {/* Page Content */}
              <div className="prose prose-invert max-w-none">
                <EditableText
                  contentKey={`page-${page.id}-content`}
                  defaultValue={page.content}
                  as="div"
                  className="text-white"
                />
              </div>

              {/* Admin Status Indicator */}
              {isAdmin && !page.published && (
                <div className="mt-8 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <p className="text-yellow-200">
                    <strong>Draft:</strong> This page is not published and is only visible to administrators.
                  </p>
                </div>
              )}
            </div>
          </main>
          
          <Footer />
        </VisualEditor>
        
        <RadioPlayer />
        <ChatBot />
        <SocialChat />
        <EditModeToggle />
        <Toaster position="top-center" richColors />
      </div>
    </InlineEditProvider>
  );
};

export default DynamicPage;