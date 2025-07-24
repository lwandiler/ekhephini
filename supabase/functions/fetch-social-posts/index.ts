import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

async function fetchFacebookPosts(pageId: string, accessToken: string): Promise<SocialPost[]> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,likes.summary(true),comments.summary(true),shares,permalink_url,attachments{media}&access_token=${accessToken}&limit=10`
    );
    const data = await response.json();
    
    if (!data.data) return [];
    
    return data.data.map((post: any) => ({
      id: post.id,
      platform: 'facebook' as const,
      content: post.message || 'Facebook post',
      author: 'Facebook Page',
      date: post.created_time,
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      url: post.permalink_url,
      image: post.attachments?.data?.[0]?.media?.image?.src
    }));
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return [];
  }
}

async function fetchTwitterPosts(username: string, bearerToken: string): Promise<SocialPost[]> {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
    const userData = await response.json();
    
    if (!userData.data) return [];
    
    const userId = userData.data.id;
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url&max_results=10`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
    
    const tweetsData = await tweetsResponse.json();
    
    if (!tweetsData.data) return [];
    
    return tweetsData.data.map((tweet: any) => ({
      id: tweet.id,
      platform: 'twitter' as const,
      content: tweet.text,
      author: username,
      date: tweet.created_at,
      likes: tweet.public_metrics?.like_count || 0,
      shares: tweet.public_metrics?.retweet_count || 0,
      comments: tweet.public_metrics?.reply_count || 0,
      url: `https://twitter.com/${username}/status/${tweet.id}`,
      image: tweetsData.includes?.media?.[0]?.url
    }));
  } catch (error) {
    console.error('Error fetching Twitter posts:', error);
    return [];
  }
}

async function fetchInstagramPosts(userId: string, accessToken: string): Promise<SocialPost[]> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,permalink&access_token=${accessToken}&limit=10`
    );
    const data = await response.json();
    
    if (!data.data) return [];
    
    return data.data.map((post: any) => ({
      id: post.id,
      platform: 'instagram' as const,
      content: post.caption || 'Instagram post',
      author: 'Instagram Account',
      date: post.timestamp,
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      url: post.permalink,
      image: post.media_type === 'IMAGE' ? post.media_url : post.thumbnail_url
    }));
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

async function fetchYouTubePosts(channelId: string, apiKey: string): Promise<SocialPost[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
    );
    const data = await response.json();
    
    if (!data.items) return [];
    
    return data.items.map((video: any) => ({
      id: video.id.videoId,
      platform: 'youtube' as const,
      content: video.snippet.title,
      author: video.snippet.channelTitle,
      date: video.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      image: video.snippet.thumbnails.medium.url
    }));
  } catch (error) {
    console.error('Error fetching YouTube posts:', error);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { platforms, check_config } = await req.json()
    
    // Get API keys from environment
    const facebookToken = Deno.env.get('FACEBOOK_ACCESS_TOKEN')
    const facebookPageId = Deno.env.get('FACEBOOK_PAGE_ID')
    const twitterToken = Deno.env.get('TWITTER_BEARER_TOKEN')
    const twitterUsername = Deno.env.get('TWITTER_USERNAME')
    const instagramToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
    const instagramUserId = Deno.env.get('INSTAGRAM_USER_ID')
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    const youtubeChannelId = Deno.env.get('YOUTUBE_CHANNEL_ID')
    
    // If check_config is true, just return which platforms are configured
    if (check_config) {
      const configuredPlatforms = []
      
      if (facebookToken && facebookPageId) {
        configuredPlatforms.push('facebook')
      }
      if (twitterToken && twitterUsername) {
        configuredPlatforms.push('twitter')
      }
      if (instagramToken && instagramUserId) {
        configuredPlatforms.push('instagram')
      }
      if (youtubeApiKey && youtubeChannelId) {
        configuredPlatforms.push('youtube')
      }
      
      return new Response(
        JSON.stringify({ configured_platforms: configuredPlatforms }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    const allPosts: SocialPost[] = []
    
    // Fetch posts from each platform if configured
    if (platforms.includes('facebook') && facebookToken && facebookPageId) {
      const facebookPosts = await fetchFacebookPosts(facebookPageId, facebookToken)
      allPosts.push(...facebookPosts)
    }
    
    if (platforms.includes('twitter') && twitterToken && twitterUsername) {
      const twitterPosts = await fetchTwitterPosts(twitterUsername, twitterToken)
      allPosts.push(...twitterPosts)
    }
    
    if (platforms.includes('instagram') && instagramToken && instagramUserId) {
      const instagramPosts = await fetchInstagramPosts(instagramUserId, instagramToken)
      allPosts.push(...instagramPosts)
    }
    
    if (platforms.includes('youtube') && youtubeApiKey && youtubeChannelId) {
      const youtubePosts = await fetchYouTubePosts(youtubeChannelId, youtubeApiKey)
      allPosts.push(...youtubePosts)
    }
    
    // Sort by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return new Response(
      JSON.stringify({ posts: allPosts }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})