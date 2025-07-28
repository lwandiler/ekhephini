function parseTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

interface Show {
  id: string;
  title: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description?: string | null;
  image_url?: string | null;
}

interface RecordingWithShow {
  id: string;
  title: string;
  description: string | null;
  show_id: string | null;
  recorded_at: string;
  audio_url: string;
  duration_seconds: number | null;
  expires_at: string;
  shows?: {
    title: string;
    host: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    description?: string | null;
    image_url?: string | null;
  } | null;
}

/**
 * Calculates when a show recording should become available
 * Recording becomes available 1 hour after the show's scheduled end time
 */
export function getRecordingAvailabilityTime(show: Show): Date {
  const now = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentDayIndex = daysOfWeek.indexOf(currentDay);
  const showDayIndex = daysOfWeek.indexOf(show.day_of_week);
  
  // Parse end time
  const [endHours, endMinutes] = show.end_time.split(':').map(Number);
  
  // Calculate the most recent occurrence of this show
  let targetDate = new Date();
  
  if (showDayIndex === currentDayIndex) {
    // Show is today
    targetDate.setHours(endHours, endMinutes, 0, 0);
  } else if (showDayIndex < currentDayIndex) {
    // Show was earlier this week
    const daysAgo = currentDayIndex - showDayIndex;
    targetDate.setDate(targetDate.getDate() - daysAgo);
    targetDate.setHours(endHours, endMinutes, 0, 0);
  } else {
    // Show was last week (next occurrence is next week, so we want last week's)
    const daysAgo = 7 - (showDayIndex - currentDayIndex);
    targetDate.setDate(targetDate.getDate() - daysAgo);
    targetDate.setHours(endHours, endMinutes, 0, 0);
  }
  
  // Add 1 hour delay
  targetDate.setHours(targetDate.getHours() + 1);
  
  return targetDate;
}

/**
 * Checks if a recording should be available now based on the 3-day + 1-hour rule
 */
export function isRecordingAvailable(show: Show): boolean {
  const availabilityTime = getRecordingAvailabilityTime(show);
  const now = new Date();
  const threeDaysLater = new Date(availabilityTime.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  // Recording is available if:
  // 1. Current time is after availability time (show ended + 1 hour)
  // 2. Current time is within 3 days of availability time
  return now >= availabilityTime && now <= threeDaysLater;
}

/**
 * Filters recordings to only show those available within the 3-day window
 */
export function filterAvailableRecordings(recordings: RecordingWithShow[], allShows: Show[]): RecordingWithShow[] {
  return recordings.filter(recording => {
    if (!recording.show_id || !recording.shows) return false;
    
    const show: Show = {
      id: recording.show_id,
      title: recording.shows.title,
      host: recording.shows.host,
      day_of_week: recording.shows.day_of_week,
      start_time: recording.shows.start_time,
      end_time: recording.shows.end_time,
      description: recording.shows.description,
      image_url: recording.shows.image_url
    };
    
    return isRecordingAvailable(show);
  });
}

/**
 * Gets the time remaining until a recording becomes available
 */
export function getTimeUntilAvailable(show: Show): string {
  const availabilityTime = getRecordingAvailabilityTime(show);
  const now = new Date();
  
  if (now >= availabilityTime) return 'Available now';
  
  const timeDiff = availabilityTime.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `Available in ${hours}h ${minutes}m`;
  } else {
    return `Available in ${minutes}m`;
  }
}

/**
 * Gets the time remaining until a recording expires (3 days after becoming available)
 */
export function getTimeUntilExpired(show: Show): string {
  const availabilityTime = getRecordingAvailabilityTime(show);
  const expiryTime = new Date(availabilityTime.getTime() + 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  if (now >= expiryTime) return 'Expired';
  
  const timeDiff = expiryTime.getTime() - now.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `Expires in ${days}d ${hours}h`;
  } else if (hours > 0) {
    return `Expires in ${hours}h ${minutes}m`;
  } else {
    return `Expires in ${minutes}m`;
  }
}