
import { useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { RadioStation } from '../types';
import { useHowlerInitializer } from './useHowlerInitializer';
import { useAudioContextUnlocker } from './useAudioContextUnlocker';
import { useAudioUnlocker } from './useAudioUnlocker';

export function useHowlerPlayer() {
  const { createHowlerInstance } = useHowlerInitializer();
  const { unlockAudioContext } = useAudioContextUnlocker();
  const { unlockAudioForBrowsers } = useAudioUnlocker();

  // Initialize Howler player
  const initializeHowlerAudio = useCallback((
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    retryCount: React.MutableRefObject<number>,
    maxRetries: number = 3,
    sound: React.MutableRefObject<Howl | null>
  ) => {
    setStreamError(null);
    
    try {
      // First, try to forcibly unlock the AudioContext
      unlockAudioForBrowsers();
      
      // Also try to force Howler context
      if (Howler.ctx && Howler.ctx.state === "suspended") {
        console.log("Resuming Howler context");
        Howler.ctx.resume().catch(e => console.error("Failed to resume Howler context:", e));
      }
      
      // Get the station URL - try primary first this time
      const stationUrl = stations[currentStation].url;
      const alternativeUrl = stations[currentStation].fallbackUrl;
      
      // Create a new Howler instance
      const howl = createHowlerInstance(
        stationUrl,
        alternativeUrl,
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
      
      // Try to forcibly play after a short delay (give browser time to process)
      setTimeout(() => {
        if (sound.current && !sound.current.playing()) {
          console.log("Attempting delayed play");
          sound.current.play();
        }
      }, 500);
      
    } catch (error) {
      console.error("Error creating Howl instance:", error);
      setStreamError("Failed to initialize audio player");
    }
  }, [createHowlerInstance, unlockAudioForBrowsers]);

  return {
    initializeHowlerAudio,
    unlockAudioContext
  };
}
