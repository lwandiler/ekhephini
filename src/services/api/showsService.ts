// Temporary stub for shows service
export interface ShowWithFormattedTime {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  formattedTime: string;
  host?: string;
  time?: string;
  description?: string;
  day_of_week?: string;
  image_url?: string | null;
}

export const showsService = {
  getCurrentShow: () => Promise.resolve(null),
  getUpcomingShows: () => Promise.resolve([])
};