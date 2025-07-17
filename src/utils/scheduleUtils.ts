
import { DaySchedule, ShowWithFormattedTime } from '@/services/api/showsService';

export function getCurrentShow(schedule: DaySchedule[]): ShowWithFormattedTime | null {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // Find today's schedule
  const todaySchedule = schedule.find(day => day.day === currentDay);
  if (!todaySchedule || todaySchedule.shows.length === 0) {
    return null;
  }

  // Find the current show
  for (const show of todaySchedule.shows) {
    const startTime = parseTimeToMinutes(show.start_time);
    const endTime = parseTimeToMinutes(show.end_time);
    
    // Handle shows that cross midnight
    if (endTime < startTime) {
      if (currentTime >= startTime || currentTime < endTime) {
        return show;
      }
    } else {
      if (currentTime >= startTime && currentTime < endTime) {
        return show;
      }
    }
  }

  return null;
}

function parseTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
