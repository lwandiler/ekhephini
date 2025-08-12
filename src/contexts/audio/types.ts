
import { RadioStation } from "@/hooks/audio/types";

export interface AudioPlayerContextProps {
  stations: RadioStation[];
  currentStationIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  streamError: string | null;
  playCurrentStation: () => void;
  pauseCurrentStation: () => void;
  togglePlayPause: () => void;
  playNextStation: () => void;
  playPreviousStation: () => void;
  setVolume: (volume: number) => void;
  forceTryPlay: () => void;
  getCurrentStationName: () => string;
  playExternalUrl: (name: string, url: string) => void;
}

export interface AudioState {
  stations: RadioStation[];
  currentStationIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  streamError: string | null;
}
