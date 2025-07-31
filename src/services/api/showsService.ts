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
}

export const showsService = {
  getCurrentShow: () => Promise.resolve(null),
  getUpcomingShows: () => Promise.resolve([])
};