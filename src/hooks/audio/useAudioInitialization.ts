
import { useCallback } from 'react';
import { Howl } from 'howler';
import { RadioStation } from './types';
import { useHowlerPlayer } from './useHowlerPlayer';
import { useHtmlAudio } from './useHtmlAudio';
import { useAudioCleanup } from './useAudioCleanup';

interface UseAudioInitializationProps {
  sound: React.MutableRefObject<Howl | null>;
  audioElement: React.MutableRefObject<HTMLAudioElement | null>;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStreamError: (error: string | null) => void;
  retryCount: React.MutableRefObject<number>;
  stations: RadioStation[];
  currentStation: number;
  volume: number;
  fallbackMode: boolean;
  isInitialized: React.MutableRefObject<boolean>;
}

export function useAudioInitialization({
  sound,
  audioElement,
  setIsPlaying,
  setIsLoading,
  setStreamError,
  retryCount,
  stations,
  currentStation,
  volume,
  fallbackMode,
  isInitialized
}: UseAudioInitializationProps) {
  const maxRetries = 3;
  const { initializeHowlerAudio } = useHowlerPlayer();
  const { initializeHtmlAudio } = useHtmlAudio();
  const { cleanupAudio } = useAudioCleanup();

  // Function to reset retry counter
  const resetRetryCount = () => {
    retryCount.current = 0;
  };

  // Initialize the audio player based on mode
  const initializeAudioPlayer = useCallback(() => {
    if (fallbackMode) {
      console.log("Using HTML5 Audio fallback mode");
      initializeHtmlAudio(
        currentStation, 
        stations, 
        volume, 
        setIsPlaying, 
        setIsLoading, 
        setStreamError, 
        audioElement
      );
    } else {
      console.log("Using Howler for audio playback");
      initializeHowlerAudio(
        currentStation, 
        stations, 
        volume, 
        setIsPlaying, 
        setIsLoading, 
        setStreamError, 
        retryCount, 
        maxRetries, 
        sound
      );
    }
  }, [
    fallbackMode, 
    currentStation, 
    stations, 
    volume, 
    setIsPlaying,
    setIsLoading,
    setStreamError,
    audioElement,
    sound,
    initializeHowlerAudio,
    initializeHtmlAudio,
    retryCount
  ]);

  // Cleanup function for audio resources
  const cleanupAudioPlayer = useCallback((resetRetryCountFn: () => void) => {
    cleanupAudio(
      sound,
      audioElement,
      setIsPlaying,
      setIsLoading,
      resetRetryCountFn
    );
  }, [
    sound,
    audioElement,
    setIsPlaying,
    setIsLoading,
    cleanupAudio
  ]);

  return {
    initializeAudioPlayer,
    cleanupAudioPlayer
  };
}
