
import { useCallback } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '../types';

interface UseInitializationProps {
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStreamError: (error: string | null) => void;
  retryCount: React.MutableRefObject<number>;
  maxRetries: number;
}

export function useInitialization({
  setIsPlaying,
  setIsLoading,
  setStreamError,
  retryCount,
  maxRetries
}: UseInitializationProps) {
  
  // Check if audio needs initialization
  const handleInitialization = useCallback((
    isInitialized: React.MutableRefObject<boolean>,
    fallbackMode: boolean,
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    sound: React.MutableRefObject<Howl | null>,
    initializeHtmlAudio: Function,
    initializeHowlerAudio: Function
  ) => {
    // Check if stream URL is available first
    const streamUrl = stations[currentStation]?.streamUrl || stations[currentStation]?.url;
    if (!streamUrl) {
      console.log("No stream URL available, skipping initialization");
      setIsLoading(false);
      setStreamError("Stream offline");
      setIsPlaying(false);
      return false;
    }
    
    // If not initialized, initialize first
    if (!isInitialized.current) {
      isInitialized.current = true;
      
      if (fallbackMode) {
        console.log("Initializing HTML5 Audio during toggle");
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
        console.log("Initializing Howler during toggle");
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
      
      // Wait briefly for initialization to complete
      return true;
    }
    
    return false;
  }, [setIsPlaying, setIsLoading, setStreamError, retryCount, maxRetries]);

  return {
    handleInitialization
  };
}
