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
          showStats
        ] = await Promise.all([
          analyticsService.getTotalStats(),
          analyticsService.getListenerGrowth(days),
          analyticsService.getGeographicData(),
          analyticsService.getDeviceStats(),
          analyticsService.getListeningHours(),
          analyticsService.getShowStats(days)
        ]);

        setData({
          ...totalStats,
          listenerGrowth,
          geographicData,
          deviceStats,
          listeningHours,
          showStats,
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

  return {
    trackPageView,
    trackPlay,
    trackPause,
    trackStop,
    trackVolumeChange
  };
};