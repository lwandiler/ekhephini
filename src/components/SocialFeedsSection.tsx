import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Facebook, Twitter, Instagram, Youtube, ExternalLink, Calendar, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StationContext } from '@/contexts/StationContext';
import { supabase } from '@/integrations/supabase/client';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  author: string;
  date: string;
  likes?: number;
  shares?: number;
  comments?: number;
  url?: string;
  image?: string;
}

const fetchSocialPosts = async (platforms: string[]): Promise<SocialPost[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-social-posts', {
      body: { platforms }
    });
    
    if (error) {
      console.error('Error fetching social posts:', error);
      return [];
    }
    
    return data.posts || [];
  } catch (error) {
    console.error('Error calling fetch-social-posts function:', error);
    return [];
  }
};

const SocialFeedsSection = () => {
  const { settings } = useContext(StationContext);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check which social media platforms have been configured
    const platforms = [];
    if (settings.socialLinks.facebook && settings.socialLinks.facebook !== 'https://facebook.com/clickradio') {
      platforms.push('facebook');
    }
    if (settings.socialLinks.twitter && settings.socialLinks.twitter !== 'https://twitter.com/clickradio') {
      platforms.push('twitter');
    }
    if (settings.socialLinks.instagram && settings.socialLinks.instagram !== 'https://instagram.com/clickradio') {
      platforms.push('instagram');
    }
    if (settings.socialLinks.youtube && settings.socialLinks.youtube !== 'https://youtube.com/clickradio') {
      platforms.push('youtube');
    }

    setActivePlatforms(platforms);
    
    // Fetch real social media posts
    if (platforms.length > 0) {
      setLoading(true);
      fetchSocialPosts(platforms).then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      });
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [settings.socialLinks]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  // Don't render if no platforms are configured
  if (activePlatforms.length === 0) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-foreground">Loading social media posts...</span>
          </div>
        </div>
      </section>
    );
  }

  // If only one platform is configured, show its feed directly
  if (activePlatforms.length === 1) {
    const platform = activePlatforms[0];
    const platformPosts = posts.filter(post => post.platform === platform);

    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {getPlatformIcon(platform)}
            <h2 className="text-3xl font-bold text-foreground">
              Our {formatPlatformName(platform)} Feed
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium text-sm text-muted-foreground">
                        {formatPlatformName(post.platform)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Social media post" 
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-sm text-foreground mb-4">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-4">
                      {post.likes && <span>👍 {post.likes}</span>}
                      {post.shares && <span>🔄 {post.shares}</span>}
                      {post.comments && <span>💬 {post.comments}</span>}
                    </div>
                    {post.url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Multiple platforms - show tabs
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Social Feeds</h2>
        
        <Tabs defaultValue={activePlatforms[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {activePlatforms.map((platform) => (
              <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                {getPlatformIcon(platform)}
                <span className="hidden sm:inline">{formatPlatformName(platform)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {activePlatforms.map((platform) => {
            const platformPosts = posts.filter(post => post.platform === platform);
            
            return (
              <TabsContent key={platform} value={platform}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platformPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{post.author}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(post.date)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Social media post" 
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                        )}
                        <p className="text-sm text-foreground mb-4">{post.content}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex gap-4">
                            {post.likes && <span>👍 {post.likes}</span>}
                            {post.shares && <span>🔄 {post.shares}</span>}
                            {post.comments && <span>💬 {post.comments}</span>}
                          </div>
                          {post.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={post.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {platformPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts available for {formatPlatformName(platform)}</p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default SocialFeedsSection;