
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

export function hasShowPassed(show: ShowWithFormattedTime, schedule: DaySchedule[]): boolean {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Find which day this show is on
  const showDay = schedule.find(day => day.shows.some(s => s.id === show.id))?.day;
  if (!showDay) return false;
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = daysOfWeek.indexOf(currentDay);
  const showDayIndex = daysOfWeek.indexOf(showDay);
  
  // If show is on a different day
  if (showDayIndex !== todayIndex) {
    // Show is in the past if it's on a previous day this week
    return showDayIndex < todayIndex;
  }
  
  // Show is today - check if end time has passed
  const endTime = parseTimeToMinutes(show.end_time);
  return currentTime > endTime;
}

export function getNextShowOccurrence(show: ShowWithFormattedTime, schedule: DaySchedule[]): string {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Find which day this show is on
  const showDay = schedule.find(day => day.shows.some(s => s.id === show.id))?.day;
  if (!showDay) return show.time;
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = daysOfWeek.indexOf(currentDay);
  const showDayIndex = daysOfWeek.indexOf(showDay);
  const startTime = parseTimeToMinutes(show.start_time);
  
  // If show is today and hasn't started yet
  if (showDayIndex === todayIndex && currentTime < startTime) {
    return `today at ${show.time}`;
  }
  
  // Calculate days until next occurrence
  let daysUntilNext;
  if (showDayIndex <= todayIndex) {
    // Show is today (but passed) or earlier in the week - next occurrence is next week
    daysUntilNext = 7 - (todayIndex - showDayIndex);
  } else {
    // Show is later this week
    daysUntilNext = showDayIndex - todayIndex;
  }
  
  if (daysUntilNext === 1) {
    return `tomorrow at ${show.time}`;
  } else if (daysUntilNext === 7) {
    return `next ${showDay} at ${show.time}`;
  } else {
    return `in ${daysUntilNext} days on ${showDay} at ${show.time}`;
  }
}
