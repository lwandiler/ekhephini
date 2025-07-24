import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';

import NewsList from '@/components/NewsList';
import AdBanner from '@/components/AdBanner';
import NewsletterForm from '@/components/NewsletterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blogService, BlogPost } from '@/services/api/blogService';

// Transform blog posts to match NewsItem interface
const transformBlogPostsToNews = (posts: BlogPost[]) => {
  return posts.map((post) => ({
    id: post.id, // Use the actual blog post ID
    title: post.title,
    excerpt: post.excerpt || post.content.substring(0, 200) + '...',
    image: post.featured_image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    date: post.published_at || post.created_at!,
    author: post.author,
    category: post.category || "News"
  }));
};

const News = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await blogService.getPublishedPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const newsArticles = transformBlogPostsToNews(blogPosts);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading news articles...</div>
        </main>
        <Footer />
        <RadioPlayer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-radio-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">News & Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Stay up to date with the latest news from the world of music, radio, and our station.
            </p>
          </div>
        </section>
        
        {/* Ad Banner */}
        <AdBanner position="top" />
        
        {/* News Categories */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="all" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">All News</TabsTrigger>
                  <TabsTrigger value="station" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Station News</TabsTrigger>
                  <TabsTrigger value="events" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Events</TabsTrigger>
                  <TabsTrigger value="interviews" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Interviews</TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-radio-blue data-[state=active]:text-white">Reviews</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <NewsList news={newsArticles} />
              </TabsContent>
              
              <TabsContent value="station">
                <NewsList news={newsArticles.filter(item => item.category === "Station News")} />
              </TabsContent>
              
              <TabsContent value="events">
                <NewsList news={newsArticles.filter(item => item.category === "Events")} />
              </TabsContent>
              
              <TabsContent value="interviews">
                <NewsList news={newsArticles.filter(item => item.category === "Interviews")} />
              </TabsContent>
              
              <TabsContent value="reviews">
                <NewsList news={newsArticles.filter(item => item.category === "Reviews")} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-radio-blue mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest news, show updates, and exclusive content delivered directly to your inbox.
            </p>
            <NewsletterForm variant="news" />
          </div>
        </section>
      </main>
      
      <Footer />
      <RadioPlayer />
      
    </div>
  );
};

export default News;
