
export interface TrackData {
  id: string;
  position: number;      // Current chart position
  prevPosition: number;  // Previous chart position (0 for new entries)
  movement: number;      // Positive for moving up, negative for moving down, 0 for no change
  title: string;
  artist: string;
  album: string;
  plays: number;
  artwork: string;
}

export interface ChartData {
  weekly: TrackData[];
  monthly: TrackData[];
}
