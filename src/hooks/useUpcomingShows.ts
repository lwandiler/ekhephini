import { useState, useEffect } from 'react';
import { DaySchedule, ShowWithFormattedTime, fetchShows } from '@/services/api/showsService';
import { getCurrentShow } from '@/utils/scheduleUtils';

function parseTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function getUpcomingShows(schedule: DaySchedule[], currentShow: ShowWithFormattedTime | null): ShowWithFormattedTime[] {
  if (schedule.length === 0) return [];

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDayIndex = dayOrder.indexOf(currentDay);
  
  const upcomingShows: ShowWithFormattedTime[] = [];
  
  // Start from current day and look forward
  for (let dayOffset = 0; dayOffset < 7 && upcomingShows.length < 3; dayOffset++) {
    const dayIndex = (currentDayIndex + dayOffset) % 7;
    const day = dayOrder[dayIndex];
    const daySchedule = schedule.find(s => s.day === day);
    
    if (!daySchedule || daySchedule.shows.length === 0) continue;
    
    for (const show of daySchedule.shows) {
      if (upcomingShows.length >= 3) break;
      
      const showStartTime = parseTimeToMinutes(show.start_time);
      
      // For current day, only include shows that start after current time or after current show ends
      if (dayOffset === 0) {
        if (currentShow) {
          const currentShowEndTime = parseTimeToMinutes(currentShow.end_time);
          // Skip the current show and shows that have already started
          if (show.id === currentShow.id || showStartTime <= currentTime) {
            continue;
          }
        } else {
          // No current show, include shows that start after current time
          if (showStartTime <= currentTime) {
            continue;
          }
        }
      }
      
      upcomingShows.push(show);
    }
  }
  
  return upcomingShows;
}

export function useUpcomingShows() {
  const [upcomingShows, setUpcomingShows] = useState<ShowWithFormattedTime[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchShows();
        setSchedule(data);
        const currentShow = getCurrentShow(data);
        setUpcomingShows(getUpcomingShows(data, currentShow));
      } catch (error) {
        console.error('Error loading schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  // Update upcoming shows every minute
  useEffect(() => {
    if (schedule.length === 0) return;

    const interval = setInterval(() => {
      const currentShow = getCurrentShow(schedule);
      setUpcomingShows(getUpcomingShows(schedule, currentShow));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [schedule]);

  return { upcomingShows, loading };
}