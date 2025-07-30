
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Show = Tables<'shows'>;

export interface ShowWithFormattedTime extends Omit<Show, 'start_time' | 'end_time'> {
  time: string;
  start_time: string;
  end_time: string;
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
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
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
    const groupedShows: { [key: string]: ShowWithFormattedTime[] } = {};

    shows?.forEach(show => {
      if (!show.day_of_week) return;
      
      if (!groupedShows[show.day_of_week]) {
        groupedShows[show.day_of_week] = [];
      }

      groupedShows[show.day_of_week].push({
        ...show,
        time: formatTimeRange(show.start_time, show.end_time),
        start_time: show.start_time,
        end_time: show.end_time
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

// Fetch all active shows for the shows page
export async function fetchAllShows(): Promise<ShowWithFormattedTime[]> {
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

    return shows?.map(show => ({
      ...show,
      time: show.day_of_week ? `${show.day_of_week} ${formatTimeRange(show.start_time, show.end_time)}` : formatTimeRange(show.start_time, show.end_time),
      start_time: show.start_time,
      end_time: show.end_time
    })) || [];

  } catch (error) {
    console.error('Failed to fetch shows:', error);
    return [];
  }
}

// Fetch shows with pagination
export async function fetchShowsWithPagination(page: number = 1, pageSize: number = 6): Promise<{ shows: ShowWithFormattedTime[], totalCount: number, totalPages: number }> {
  try {
    // Get total count first
    const { count, error: countError } = await supabase
      .from('shows')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    if (countError) {
      console.error('Error fetching shows count:', countError);
      throw countError;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Calculate offset
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Fetch paginated shows
    const { data: shows, error } = await supabase
      .from('shows')
      .select('*')
      .eq('active', true)
      .order('day_of_week')
      .order('start_time')
      .range(from, to);

    if (error) {
      console.error('Error fetching shows:', error);
      throw error;
    }

    const formattedShows = shows?.map(show => ({
      ...show,
      time: show.day_of_week ? `${show.day_of_week} ${formatTimeRange(show.start_time, show.end_time)}` : formatTimeRange(show.start_time, show.end_time),
      start_time: show.start_time,
      end_time: show.end_time
    })) || [];

    return {
      shows: formattedShows,
      totalCount,
      totalPages
    };

  } catch (error) {
    console.error('Failed to fetch shows with pagination:', error);
    return {
      shows: [],
      totalCount: 0,
      totalPages: 0
    };
  }
}
