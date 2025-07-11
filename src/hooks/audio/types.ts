
export interface RadioStation {
  id?: string;
  name: string;
  url: string;
  fallbackUrl?: string;
  description?: string;
  genre?: string;
  logo?: string;
  streamUrl?: string; // Added to support station settings stream URL
}

export interface SongMetadata {
  artist: string;
  title: string;
  albumCover?: string;
}

export interface AudioPlayerProps {
  stations: RadioStation[];
  initialVolume?: number;
  fallbackMode?: boolean;
  autoInitialize?: boolean;
}

export interface AudioPlayerReturn {
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  currentStation: number;
  streamError: string | null;
  togglePlayPause: () => void;
  handleVolumeChange: (volume: number[]) => void;
  changeStation: (direction: 'next' | 'prev') => void;
  forceTryPlay: () => void;
}
