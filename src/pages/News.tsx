import React, { useState, useEffect } from 'react';
import RadioNavigation from '@/components/RadioNavigation';
import RadioHeroSection from '@/components/RadioHeroSection';
import RadioPlayerSection from '@/components/RadioPlayerSection';
import PresentersTestimonialsSection from '@/components/PresentersTestimonialsSection';
import NewsletterFooter from '@/components/NewsletterFooter';
import NewsList from '@/components/NewsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blogService, BlogPost } from '@/services/api/blogService';

// Transform blog posts to match NewsItem interface
const transformBlogPostsToNews = (posts: BlogPost[]) => {
  return posts.map((post) => ({
    id: post.id,
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
      <div className="w-full min-h-screen bg-white font-asap">
        <RadioNavigation />
        <main className="flex-1 flex items-center justify-center h-96">
          <div className="text-gray-500">Loading news articles...</div>
        </main>
        <NewsletterFooter />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-asap">
      {/* Navigation */}
      <RadioNavigation />

      {/* Hero Section with News heading */}
      <section className="relative w-full h-[814px] overflow-hidden">
        {/* Background Image */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/e154fb9d1aed06944969aa7592132dfc209c4bc2?width=2928"
          alt="Radio Station Background"
          className="absolute -left-3 top-0 w-[1464px] h-[823px] object-cover backdrop-blur-[50px]"
        />

        {/* Blue Gradient Overlay */}
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-[#004995] opacity-78 backdrop-blur-[50px]"></div>

        {/* Logo Overlay */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/83493488be7d7e8aac21d19be5cf584126ee0efc?width=660"
          alt="Station Logo"
          className="absolute right-[160px] top-[350px] w-[330px] h-[207px] object-contain"
        />

        {/* Content */}
        <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:px-[185px] py-8 md:py-16 lg:py-32 xl:py-[209px] h-full flex flex-col justify-start">
          <h1 className="max-w-[600px] text-white font-asap text-4xl md:text-6xl lg:text-7xl xl:text-[96px] font-bold leading-normal mb-8 md:mb-12">
            News & Updates
          </h1>

          <p className="max-w-[575px] text-white font-asap text-lg md:text-xl lg:text-2xl xl:text-[25px] font-normal leading-normal mb-12 md:mb-16">
            Stay up to date with the latest news from the world of music, radio, and our station. Get exclusive stories and behind-the-scenes content.
          </p>
        </div>
      </section>

      {/* Radio Player Section */}
      <RadioPlayerSection />

      {/* News Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-[185px]">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#004995] data-[state=active]:text-white">All News</TabsTrigger>
                <TabsTrigger value="station" className="data-[state=active]:bg-[#004995] data-[state=active]:text-white">Station News</TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-[#004995] data-[state=active]:text-white">Events</TabsTrigger>
                <TabsTrigger value="interviews" className="data-[state=active]:bg-[#004995] data-[state=active]:text-white">Interviews</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-[#004995] data-[state=active]:text-white">Reviews</TabsTrigger>
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

      {/* Presenters & Testimonials */}
      <PresentersTestimonialsSection />

      {/* Newsletter Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default News;
