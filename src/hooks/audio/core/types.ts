
import { MutableRefObject } from 'react';
import { Howl } from 'howler';

export interface AudioPlayerState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentStation: number;
  setCurrentStation: (station: number) => void;
  streamError: string | null;
  setStreamError: (error: string | null) => void;
  sound: MutableRefObject<Howl | null>;
  audioElement: MutableRefObject<HTMLAudioElement | null>;
  retryCount: MutableRefObject<number>;
  isInitialized: MutableRefObject<boolean>;
  fallbackMode: boolean;
  autoInitialize: boolean;
}
