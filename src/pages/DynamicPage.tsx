import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InlinePageEditor from '@/components/InlinePageEditor';
import { InlineEditProvider } from '@/contexts/InlineEditContext';
import EditModeToggle from '@/components/EditModeToggle';

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  return (
    <InlineEditProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <InlinePageEditor pageId={slug}>
          {(page, isEditing) => {
            if (!page) {
              return (
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              );
            }

            return (
              <main className="min-h-screen">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-radio-primary to-radio-secondary py-16">
                  <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {page.title}
                    </h1>
                    {page.excerpt && (
                      <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        {page.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Page Content */}
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-4xl mx-auto">
                    {page.featured_image && (
                      <div className="mb-8">
                        <img
                          src={page.featured_image}
                          alt={page.title}
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    
                    <div 
                      className={`prose prose-lg max-w-none ${isEditing ? 'bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4' : ''}`}
                      dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                  </div>
                </div>
              </main>
            );
          }}
        </InlinePageEditor>
        
        <Footer />
        <EditModeToggle />
      </div>
    </InlineEditProvider>
  );
};

export default DynamicPage;