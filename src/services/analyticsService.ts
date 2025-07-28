import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsSession {
  session_id: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  page_url: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
}

export interface ListeningEvent {
  session_id: string;
  event_type: 'play' | 'pause' | 'stop' | 'volume_change';
  station_name?: string;
  show_name?: string;
  volume_level?: number;
  duration_before_event?: number;
  user_agent?: string;
  ip_address?: string;
  country?: string;
  city?: string;
  device_type?: string;
}

export interface DailyStat {
  date: string;
  total_unique_visitors: number;
  total_sessions: number;
  total_page_views: number;
  total_listening_time: number;
  average_session_duration: number;
  peak_concurrent_listeners: number;
  bounce_rate: number;
}

export interface ShowStat {
  show_name: string;
  date: string;
  total_listeners: number;
  total_listening_time: number;
  average_session_duration: number;
  peak_concurrent_listeners: number;
}

class AnalyticsService {
  private sessionId: string;
  private sessionStartTime: number;
  private currentSessionData: AnalyticsSession | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    // Detect device type
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { deviceType, browser, os };
  }

  private async initializeSession() {
    const { deviceType, browser, os } = this.getDeviceInfo();
    
    this.currentSessionData = {
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || '',
      page_url: window.location.href,
      device_type: deviceType,
      browser: browser,
      os: os,
      started_at: new Date().toISOString(),
      duration_seconds: 0
    };

    try {
      await supabase
        .from('analytics_sessions')
        .insert(this.currentSessionData);
    } catch (error) {
      console.error('Failed to initialize analytics session:', error);
    }
  }

  async trackPageView(pageUrl: string) {
    try {
      // Update current session with new page
      await supabase
        .from('analytics_sessions')
        .update({ 
          page_url: pageUrl,
          duration_seconds: Math.floor((Date.now() - this.sessionStartTime) / 1000)
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async trackListeningEvent(event: Omit<ListeningEvent, 'session_id'>) {
    const { deviceType, browser, os } = this.getDeviceInfo();
    
    try {
      await supabase
        .from('analytics_listening_events')
        .insert({
          ...event,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          device_type: deviceType
        });
    } catch (error) {
      console.error('Failed to track listening event:', error);
    }
  }

  async endSession() {
    const duration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    
    try {
      await supabase
        .from('analytics_sessions')
        .update({ 
          ended_at: new Date().toISOString(),
          duration_seconds: duration
        })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.error('Failed to end analytics session:', error);
    }
  }

  // Analytics data retrieval methods
  async getDailyStats(days: number = 30): Promise<DailyStat[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_daily_stats')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get daily stats:', error);
      return [];
    }
  }

  async getShowStats(days: number = 30): Promise<ShowStat[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_show_stats')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('total_listeners', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get show stats:', error);
      return [];
    }
  }

  async getListenerGrowth(days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('analytics_daily_stats')
        .select('date, total_unique_visitors, total_sessions')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get listener growth:', error);
      return [];
    }
  }

  async getGeographicData() {
    try {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('country, city')
        .not('country', 'is', null)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      // Aggregate by country
      const countryData: { [key: string]: number } = {};
      data?.forEach(session => {
        if (session.country) {
          countryData[session.country] = (countryData[session.country] || 0) + 1;
        }
      });

      return Object.entries(countryData).map(([country, count]) => ({
        country,
        listeners: count
      }));
    } catch (error) {
      console.error('Failed to get geographic data:', error);
      return [];
    }
  }

  async getDeviceStats() {
    try {
      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('device_type')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      // Aggregate by device type
      const deviceData: { [key: string]: number } = {};
      data?.forEach(session => {
        const device = session.device_type || 'unknown';
        deviceData[device] = (deviceData[device] || 0) + 1;
      });

      return Object.entries(deviceData).map(([device, count]) => ({
        device,
        users: count
      }));
    } catch (error) {
      console.error('Failed to get device stats:', error);
      return [];
    }
  }

  async getListeningHours() {
    try {
      const { data, error } = await supabase
        .from('analytics_listening_events')
        .select('timestamp')
        .eq('event_type', 'play')
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      // Aggregate by hour
      const hourData: { [key: number]: number } = {};
      data?.forEach(event => {
        const hour = new Date(event.timestamp).getHours();
        hourData[hour] = (hourData[hour] || 0) + 1;
      });

      return Array.from({ length: 24 }, (_, hour) => ({
        hour,
        listeners: hourData[hour] || 0
      }));
    } catch (error) {
      console.error('Failed to get listening hours:', error);
      return [];
    }
  }

  async trackAdClick(adId: string) {
    const { deviceType, browser, os } = this.getDeviceInfo();
    
    try {
      await supabase
        .from('ad_clicks')
        .insert({
          ad_id: adId,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          device_type: deviceType
        });
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  }

  async trackContentInteraction(contentType: string, contentId: string, interactionType: string) {
    const { deviceType, browser, os } = this.getDeviceInfo();
    
    try {
      await supabase
        .from('content_interactions')
        .insert({
          content_type: contentType,
          content_id: contentId,
          interaction_type: interactionType,
          session_id: this.sessionId,
          user_agent: navigator.userAgent,
          device_type: deviceType
        });
    } catch (error) {
      console.error('Failed to track content interaction:', error);
    }
  }

  async getAdClickStats(days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('ad_clicks')
        .select(`
          ad_id,
          ads!inner(title),
          clicked_at
        `)
        .gte('clicked_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Aggregate clicks by ad
      const adClicks: { [key: string]: { title: string; clicks: number } } = {};
      data?.forEach(click => {
        const adTitle = click.ads.title;
        if (!adClicks[adTitle]) {
          adClicks[adTitle] = { title: adTitle, clicks: 0 };
        }
        adClicks[adTitle].clicks++;
      });

      return Object.values(adClicks).sort((a, b) => b.clicks - a.clicks);
    } catch (error) {
      console.error('Failed to get ad click stats:', error);
      return [];
    }
  }

  async getMostLikedContent(contentType: string, days: number = 30) {
    try {
      let selectQuery = '';
      let joinTable = '';
      
      switch (contentType) {
        case 'podcast':
          selectQuery = 'content_id, podcasts!inner(title, host)';
          joinTable = 'podcasts';
          break;
        case 'show':
          selectQuery = 'content_id, shows!inner(title, host)';
          joinTable = 'shows';
          break;
        case 'blog_post':
          selectQuery = 'content_id, blog_posts!inner(title, author)';
          joinTable = 'blog_posts';
          break;
        default:
          return [];
      }

      const { data, error } = await supabase
        .from('content_interactions')
        .select(selectQuery)
        .eq('content_type', contentType)
        .eq('interaction_type', 'like')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Aggregate likes by content
      const contentLikes: { [key: string]: { title: string; host_or_author: string; likes: number } } = {};
      data?.forEach(interaction => {
        const content = interaction[joinTable];
        const title = content.title;
        const hostOrAuthor = content.host || content.author;
        
        if (!contentLikes[title]) {
          contentLikes[title] = { title, host_or_author: hostOrAuthor, likes: 0 };
        }
        contentLikes[title].likes++;
      });

      return Object.values(contentLikes).sort((a, b) => b.likes - a.likes);
    } catch (error) {
      console.error(`Failed to get most liked ${contentType}:`, error);
      return [];
    }
  }

  async getMostViewedContent(contentType: string, days: number = 30) {
    try {
      let selectQuery = '';
      let joinTable = '';
      
      switch (contentType) {
        case 'blog_post':
          selectQuery = 'content_id, blog_posts!inner(title, author)';
          joinTable = 'blog_posts';
          break;
        default:
          return [];
      }

      const { data, error } = await supabase
        .from('content_interactions')
        .select(selectQuery)
        .eq('content_type', contentType)
        .eq('interaction_type', 'view')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Aggregate views by content
      const contentViews: { [key: string]: { title: string; author: string; views: number } } = {};
      data?.forEach(interaction => {
        const content = interaction[joinTable];
        const title = content.title;
        const author = content.author;
        
        if (!contentViews[title]) {
          contentViews[title] = { title, author, views: 0 };
        }
        contentViews[title].views++;
      });

      return Object.values(contentViews).sort((a, b) => b.views - a.views);
    } catch (error) {
      console.error(`Failed to get most viewed ${contentType}:`, error);
      return [];
    }
  }

  async getTotalStats() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      // Get unique visitors by counting distinct session IDs (more accurate for unique users)
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('analytics_sessions')
        .select('session_id')
        .gte('created_at', thirtyDaysAgo);

      if (sessionsError) throw sessionsError;

      // Count unique session IDs for unique listeners
      const uniqueSessionIds = new Set(sessionsData?.map(s => s.session_id) || []);
      const totalListeners = uniqueSessionIds.size;

      // Get average listening time
      const { data: avgTimeData, error: avgTimeError } = await supabase
        .from('analytics_sessions')
        .select('duration_seconds')
        .gte('created_at', thirtyDaysAgo)
        .not('duration_seconds', 'is', null);

      if (avgTimeError) throw avgTimeError;

      const avgDuration = avgTimeData?.length 
        ? Math.round(avgTimeData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / avgTimeData.length)
        : 0;

      // Get most popular show
      const { data: showData, error: showError } = await supabase
        .from('analytics_show_stats')
        .select('show_name, total_listeners')
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('total_listeners', { ascending: false })
        .limit(1);

      if (showError) throw showError;

      const mostPopularShow = showData?.[0] || { show_name: 'No data', total_listeners: 0 };

      return {
        totalListeners,
        avgListeningTime: avgDuration,
        mostPopularShow: mostPopularShow.show_name,
        mostPopularShowListeners: mostPopularShow.total_listeners
      };
    } catch (error) {
      console.error('Failed to get total stats:', error);
      return {
        totalListeners: 0,
        avgListeningTime: 0,
        mostPopularShow: 'No data',
        mostPopularShowListeners: 0
      };
    }
  }
}

export const analyticsService = new AnalyticsService();

// Auto-track page changes
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analyticsService.endSession();
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      analyticsService.endSession();
    }
  });
}