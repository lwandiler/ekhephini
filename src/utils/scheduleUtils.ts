
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

export function hasShowPassed(show: ShowWithFormattedTime): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // If it's not today, show hasn't passed yet
  if (show.day_of_week !== currentDay) {
    return false;
  }
  
  const endTime = parseTimeToMinutes(show.end_time);
  return currentTime >= endTime;
}

export function getNextShowOccurrence(show: ShowWithFormattedTime): string {
  const today = new Date();
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'long' });
  
  if (show.day_of_week === currentDay && !hasShowPassed(show)) {
    return 'today';
  }
  
  // Calculate days until next occurrence
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = days.indexOf(currentDay);
  const showDayIndex = days.indexOf(show.day_of_week);
  
  let daysUntil = showDayIndex - currentDayIndex;
  if (daysUntil <= 0) {
    daysUntil += 7; // Next week
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  
  return nextDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}
