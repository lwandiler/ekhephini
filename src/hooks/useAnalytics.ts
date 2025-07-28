import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';

export interface AnalyticsData {
  totalListeners: number;
  avgListeningTime: number;
  mostPopularShow: string;
  mostPopularShowListeners: number;
  listenerGrowth: Array<{ date: string; total_unique_visitors: number; total_sessions: number }>;
  geographicData: Array<{ country: string; listeners: number }>;
  deviceStats: Array<{ device: string; users: number }>;
  listeningHours: Array<{ hour: number; listeners: number }>;
  showStats: Array<{ show_name: string; total_listeners: number; total_listening_time: number }>;
  adClickStats: Array<{ title: string; clicks: number }>;
  mostLikedPodcasts: Array<{ title: string; host_or_author: string; likes: number }>;
  mostLikedShows: Array<{ title: string; host_or_author: string; likes: number }>;
  mostLikedBlogs: Array<{ title: string; host_or_author: string; likes: number }>;
  mostViewedBlogs: Array<{ title: string; author: string; views: number }>;
  isLoading: boolean;
  error: string | null;
}

export const useAnalytics = (days: number = 30) => {
  const [data, setData] = useState<AnalyticsData>({
    totalListeners: 0,
    avgListeningTime: 0,
    mostPopularShow: 'Loading...',
    mostPopularShowListeners: 0,
    listenerGrowth: [],
    geographicData: [],
    deviceStats: [],
    listeningHours: [],
    showStats: [],
    adClickStats: [],
    mostLikedPodcasts: [],
    mostLikedShows: [],
    mostLikedBlogs: [],
    mostViewedBlogs: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        const [
          totalStats,
          listenerGrowth,
          geographicData,
          deviceStats,
          listeningHours,
          showStats,
          adClickStats,
          mostLikedPodcasts,
          mostLikedShows,
          mostLikedBlogs,
          mostViewedBlogs
        ] = await Promise.all([
          analyticsService.getTotalStats(),
          analyticsService.getListenerGrowth(days),
          analyticsService.getGeographicData(),
          analyticsService.getDeviceStats(),
          analyticsService.getListeningHours(),
          analyticsService.getShowStats(days),
          analyticsService.getAdClickStats(days),
          analyticsService.getMostLikedContent('podcast', days),
          analyticsService.getMostLikedContent('show', days),
          analyticsService.getMostLikedContent('blog_post', days),
          analyticsService.getMostViewedContent('blog_post', days)
        ]);

        setData({
          ...totalStats,
          listenerGrowth,
          geographicData,
          deviceStats,
          listeningHours,
          showStats,
          adClickStats,
          mostLikedPodcasts,
          mostLikedShows,
          mostLikedBlogs,
          mostViewedBlogs,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load analytics data'
        }));
      }
    };

    fetchAnalyticsData();
  }, [days]);

  return data;
};

export const useAnalyticsTracking = () => {
  const trackPageView = (pageUrl: string) => {
    analyticsService.trackPageView(pageUrl);
  };

  const trackPlay = (stationName?: string, showName?: string) => {
    analyticsService.trackListeningEvent({
      event_type: 'play',
      station_name: stationName,
      show_name: showName
    });
  };

  const trackPause = (durationSeconds?: number) => {
    analyticsService.trackListeningEvent({
      event_type: 'pause',
      duration_before_event: durationSeconds
    });
  };

  const trackStop = (durationSeconds?: number) => {
    analyticsService.trackListeningEvent({
      event_type: 'stop',
      duration_before_event: durationSeconds
    });
  };

  const trackVolumeChange = (volumeLevel: number) => {
    analyticsService.trackListeningEvent({
      event_type: 'volume_change',
      volume_level: volumeLevel
    });
  };

  const trackAdClick = (adId: string) => {
    analyticsService.trackAdClick(adId);
  };

  const trackContentLike = (contentType: string, contentId: string) => {
    analyticsService.trackContentInteraction(contentType, contentId, 'like');
  };

  const trackContentView = (contentType: string, contentId: string) => {
    analyticsService.trackContentInteraction(contentType, contentId, 'view');
  };

  return {
    trackPageView,
    trackPlay,
    trackPause,
    trackStop,
    trackVolumeChange,
    trackAdClick,
    trackContentLike,
    trackContentView
  };
};