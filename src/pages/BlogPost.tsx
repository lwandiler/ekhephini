import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RadioPlayer from '@/components/RadioPlayer';

import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { blogService, BlogPost as BlogPostType } from '@/services/api/blogService';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        navigate('/news');
        return;
      }

      try {
        const blogPost = await blogService.getPostById(id);
        setPost(blogPost);
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive"
        });
        navigate('/news');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Events': 'bg-purple-600',
      'Station News': 'bg-blue-600',
      'Interviews': 'bg-pink-600',
      'Music': 'bg-green-600'
    };
    
    return categoryMap[category] || 'bg-purple-600';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading blog post...</div>
        </main>
        <Footer />
        <RadioPlayer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <Button onClick={() => navigate('/news')} className="bg-radio-blue hover:bg-radio-blue/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
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
        {/* Back Button */}
        <section className="py-4 border-b">
          <div className="container mx-auto px-4">
            <Button 
              onClick={() => navigate('/news')} 
              variant="ghost" 
              className="text-radio-blue hover:bg-radio-blue/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <section className="relative h-96 overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </section>
        )}

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {post.category && (
                  <span className={`text-xs font-medium ${getCategoryColor(post.category)} text-white px-3 py-1 rounded-full flex items-center gap-1`}>
                    <Tag size={12} />
                    {post.category}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b pb-6">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-radio-blue" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-radio-blue" />
                  <span>{formatDate(post.published_at || post.created_at!)}</span>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div className="prose prose-lg prose-gray max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-700 leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => navigate('/news')} 
                  variant="outline"
                  className="text-radio-blue border-radio-blue hover:bg-radio-blue hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to News
                </Button>
                
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(post.updated_at || post.created_at!)}
                </div>
              </div>
            </footer>
          </div>
        </article>
      </main>
      
      <Footer />
      <RadioPlayer />
      
    </div>
  );
};

export default BlogPost;