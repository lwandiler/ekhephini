
import { useState, useEffect } from 'react';
import { DaySchedule, ShowWithFormattedTime, fetchShows } from '@/services/api/showsService';
import { getCurrentShow } from '@/utils/scheduleUtils';

export function useCurrentShow() {
  const [currentShow, setCurrentShow] = useState<ShowWithFormattedTime | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchShows();
        setSchedule(data);
        setCurrentShow(getCurrentShow(data));
      } catch (error) {
        console.error('Error loading schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  // Update current show every minute
  useEffect(() => {
    if (schedule.length === 0) return;

    const interval = setInterval(() => {
      setCurrentShow(getCurrentShow(schedule));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [schedule]);

  return { currentShow, loading };
}
