
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
  
  // Find which day this specific show occurrence is on
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
  
  // Find all shows with the same title (recurring shows)
  const allShowOccurrences: { show: ShowWithFormattedTime; day: string; dayIndex: number }[] = [];
  
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = daysOfWeek.indexOf(currentDay);
  
  schedule.forEach(daySchedule => {
    const matchingShows = daySchedule.shows.filter(s => s.title === show.title);
    matchingShows.forEach(matchingShow => {
      allShowOccurrences.push({
        show: matchingShow,
        day: daySchedule.day,
        dayIndex: daysOfWeek.indexOf(daySchedule.day)
      });
    });
  });
  
  // Find the next occurrence of this show (by title)
  let nextOccurrence = null;
  let minDaysUntilNext = Infinity;
  
  for (const occurrence of allShowOccurrences) {
    const startTime = parseTimeToMinutes(occurrence.show.start_time);
    let daysUntilNext;
    
    if (occurrence.dayIndex === todayIndex) {
      // Show is today
      if (currentTime < startTime) {
        // Show hasn't started yet today
        return `today at ${occurrence.show.time}`;
      } else {
        // Show has passed today, next occurrence is next week
        daysUntilNext = 7;
      }
    } else if (occurrence.dayIndex > todayIndex) {
      // Show is later this week
      daysUntilNext = occurrence.dayIndex - todayIndex;
    } else {
      // Show is earlier in the week, next occurrence is next week
      daysUntilNext = 7 - (todayIndex - occurrence.dayIndex);
    }
    
    if (daysUntilNext < minDaysUntilNext) {
      minDaysUntilNext = daysUntilNext;
      nextOccurrence = occurrence;
    }
  }
  
  if (!nextOccurrence) {
    return show.time;
  }
  
  if (minDaysUntilNext === 1) {
    return `tomorrow at ${nextOccurrence.show.time}`;
  } else if (minDaysUntilNext === 7) {
    return `next ${nextOccurrence.day} at ${nextOccurrence.show.time}`;
  } else {
    return `in ${minDaysUntilNext} days on ${nextOccurrence.day} at ${nextOccurrence.show.time}`;
  }
}
