
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Show = Tables<'shows'>;

export interface ShowWithFormattedTime extends Omit<Show, 'start_time' | 'end_time'> {
  time: string;
}

export interface DaySchedule {
  day: string;
  shows: ShowWithFormattedTime[];
}

// Format time from database format (HH:MM:SS) to display format (H:MM AM/PM)
function formatTimeRange(startTime: string, endTime: string): string {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = minutes;
    
    if (hour === 0) return `12:${minute} AM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    return `${hour - 12}:${minute} PM`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export async function fetchShows(): Promise<DaySchedule[]> {
  try {
    const { data: shows, error } = await supabase
      .from('shows')
      .select('*')
      .eq('active', true)
      .order('day_of_week')
      .order('start_time');

    if (error) {
      console.error('Error fetching shows:', error);
      throw error;
    }

    // Group shows by day
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const groupedShows: { [key: string]: ShowWithFormattedTime[] } = {};

    shows?.forEach(show => {
      if (!show.day_of_week) return;
      
      if (!groupedShows[show.day_of_week]) {
        groupedShows[show.day_of_week] = [];
      }

      groupedShows[show.day_of_week].push({
        ...show,
        time: formatTimeRange(show.start_time, show.end_time)
      });
    });

    // Convert to array format with proper day ordering
    return dayOrder.map(day => ({
      day,
      shows: groupedShows[day] || []
    }));

  } catch (error) {
    console.error('Failed to fetch shows:', error);
    // Return empty schedule on error
    return dayOrder.map(day => ({ day, shows: [] }));
  }
}
