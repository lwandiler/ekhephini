
import { useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { toast } from 'sonner';
import { RadioStation } from '../types';

export function useHowlerInitializer() {
  // Function to create new Howler instance
  const createHowlerInstance = useCallback((
    stationUrl: string,
    alternativeUrl: string | undefined,
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    retryCount: React.MutableRefObject<number>,
    maxRetries: number,
    sound: React.MutableRefObject<Howl | null>
  ) => {
    console.log("Creating new Howl instance for URL:", stationUrl);

    // Clean up previous instance
    if (sound.current) {
      sound.current.unload();
    }

    // Determine format based on URL
    const format = stationUrl.includes('.m3u8') ? ['m3u8'] : ['mp3'];
    console.log("Using format:", format);

    // Create a new instance with autoplay enabled
    sound.current = new Howl({
      src: [stationUrl],
      html5: true, // Required for streaming audio and M3U8
      format: format, // Support M3U8 format
      autoplay: true, // Try to autoplay
      preload: true, // Ensure audio is preloaded
      volume: volume / 100,
      onplay: () => {
        console.log("Stream started playing successfully");
        setIsPlaying(true);
        setIsLoading(false);
        setStreamError(null);
        retryCount.current = 0; // Reset retry counter on successful play
        toast.success(`Now playing: ${stations[currentStation].name}`);
      },
      onload: () => {
        console.log("Stream loaded successfully");
        setIsLoading(false);
        setStreamError(null);
        
        // Try to force play after loading in case autoplay didn't work
        if (sound.current && !sound.current.playing()) {
          console.log("Trying to force play after load");
          sound.current.play();
        }
      },
      onloaderror: (id, error) => {
        console.error("Error loading audio:", error);
        setIsLoading(false);
        
        // Try alternative URL if available
        if (alternativeUrl && alternativeUrl !== stationUrl) {
          tryAlternativeUrl(
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
        } else if (retryCount.current < maxRetries) {
          retryAttempt(
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
        } else {
          handleStreamFailure(setIsPlaying, setIsLoading, setStreamError);
        }
      },
      onplayerror: (id, error) => {
        console.error("Error playing audio:", error);
        setIsLoading(false);
        
        // Try to resume AudioContext if suspended
        if (Howler.ctx && Howler.ctx.state === "suspended") {
          console.log("AudioContext is suspended, attempting to resume");
          Howler.ctx.resume().then(() => {
            console.log("AudioContext resumed successfully");
            if (sound.current) {
              sound.current.play();
            }
          }).catch(err => {
            console.error("Failed to resume AudioContext:", err);
            setIsPlaying(false);
            setStreamError("Browser blocked audio playback. Please interact with the page first.");
            toast.error("Audio playback blocked. Click the Force Play button.");
          });
        } else {
          // If we're here, we've tried to play but it failed for another reason
          if (retryCount.current < maxRetries) {
            retryCount.current += 1;
            console.log(`Play error - retry attempt ${retryCount.current}/${maxRetries}`);
            
            setTimeout(() => {
              if (sound.current) {
                sound.current.play();
              }
            }, 1000); // Wait 1 second before retry
          } else {
            setIsPlaying(false);
            setStreamError("Stream failed to play. Try the Force Play button or open in browser.");
            toast.error("Failed to play stream. Try the Force Play button.");
          }
        }
      },
      onstop: () => {
        console.log("Stream stopped");
        setIsPlaying(false);
      },
      onpause: () => {
        console.log("Stream paused");
        setIsPlaying(false);
      },
      onend: () => {
        console.log("Stream ended");
        setIsPlaying(false);
      }
    });
    
    return sound.current;
  }, []);

  return { createHowlerInstance };
}

// Helper functions
function tryAlternativeUrl(
  alternativeUrl: string,
  currentStation: number,
  stations: RadioStation[],
  volume: number,
  setIsPlaying: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setStreamError: (value: string | null) => void,
  retryCount: React.MutableRefObject<number>,
  maxRetries: number,
  sound: React.MutableRefObject<Howl | null>
) {
  console.log("Trying alternative URL:", alternativeUrl);
  
  if (sound.current) {
    sound.current.unload();
  }

  // Determine format for alternative URL
  const format = alternativeUrl.includes('.m3u8') ? ['m3u8'] : ['mp3'];
  
  sound.current = new Howl({
    src: [alternativeUrl],
    html5: true,
    format: format,
    autoplay: true,
    preload: true,
    volume: volume / 100,
    onplay: () => {
      console.log("Alternative stream started playing successfully");
      setIsPlaying(true);
      setIsLoading(false);
      setStreamError(null);
      toast.success(`Now playing: ${stations[currentStation].name} (alternative stream)`);
    },
    onloaderror: () => {
      console.error("Alternative URL also failed");
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        console.log(`Auto-retry attempt ${retryCount.current}/${maxRetries}`);
        
        setTimeout(() => {
          retryAttempt(
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
        }, 2000); // Wait 2 seconds before retry
      } else {
        setIsLoading(false);
        setStreamError("Stream failed to load. Try switching to fallback mode.");
      }
    }
  });
}

function retryAttempt(
  currentStation: number,
  stations: RadioStation[],
  volume: number,
  setIsPlaying: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setStreamError: (value: string | null) => void,
  retryCount: React.MutableRefObject<number>,
  maxRetries: number,
  sound: React.MutableRefObject<Howl | null>
) {
  retryCount.current += 1;
  console.log(`Retry attempt ${retryCount.current}/${maxRetries}`);
  
  setTimeout(() => {
    if (sound.current) {
      sound.current.unload();
      sound.current = null;
    }
    
    // Get the station URL - try primary first
    const stationUrl = stations[currentStation].url;
    const alternativeUrl = stations[currentStation].fallbackUrl;
    
    // Determine format based on URL
    const format = stationUrl.includes('.m3u8') ? ['m3u8'] : ['mp3'];
    
    // Create a new Howl instance with the same URL
    sound.current = new Howl({
      src: [stationUrl],
      html5: true,
      format: format,
      autoplay: true,
      preload: true,
      volume: volume / 100,
      // Reusing the same event handlers from createHowlerInstance
      onplay: () => {
        console.log("Stream started playing successfully after retry");
        setIsPlaying(true);
        setIsLoading(false);
        setStreamError(null);
        retryCount.current = 0;
        toast.success(`Now playing: ${stations[currentStation].name}`);
      },
      onloaderror: () => {
        console.error("Retry also failed");
        if (alternativeUrl && alternativeUrl !== stationUrl) {
          tryAlternativeUrl(
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
        } else if (retryCount.current < maxRetries) {
          retryAttempt(
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
        } else {
          handleStreamFailure(setIsPlaying, setIsLoading, setStreamError);
        }
      }
    });
  }, 2000); // Wait 2 seconds before retry
  
  toast.info(`Stream connection issue. Retrying... (${retryCount.current}/${maxRetries})`);
}

function handleStreamFailure(
  setIsPlaying: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setStreamError: (value: string | null) => void
) {
  setIsPlaying(false);
  setIsLoading(false);
  setStreamError("Stream failed to load. Try switching to fallback mode or open in browser.");
  toast.error("Unable to connect to stream. Please try the fallback mode.");
}
