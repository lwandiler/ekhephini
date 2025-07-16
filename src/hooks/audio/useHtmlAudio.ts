
import { useCallback } from 'react';
import { toast } from 'sonner';
import { RadioStation } from './types';

export function useHtmlAudio() {
  // Initialize HTML5 Audio as fallback
  const initializeHtmlAudio = useCallback((
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>
  ) => {
    setStreamError(null);
    
    try {
      // Clean up previous audio element
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.removeAttribute('src');
        audioElement.current.load();
      }

      // Create new audio element
      audioElement.current = new Audio();
      
      // Set volume
      audioElement.current.volume = volume / 100;
      
      // Get the station URL (prefer settings URL over station URL)
      const station = stations[currentStation];
      const stationUrl = station.streamUrl || station.url;
      
      console.log("HTML5 Audio - Setting source to:", stationUrl);
      
      // Set the source - HTML5 Audio can handle M3U8 natively in many browsers
      audioElement.current.src = stationUrl;
      audioElement.current.crossOrigin = 'anonymous'; // Enable CORS for streaming
      
      // Event listeners
      audioElement.current.addEventListener('loadstart', () => {
        console.log("HTML5 Audio - Load started");
        setIsLoading(true);
      });
      
      audioElement.current.addEventListener('canplay', () => {
        console.log("HTML5 Audio - Can play");
        setIsLoading(false);
        setStreamError(null);
      });
      
      audioElement.current.addEventListener('play', () => {
        console.log("HTML5 Audio - Started playing");
        setIsPlaying(true);
        setIsLoading(false);
        toast.success(`Now playing: ${station.name}`);
      });
      
      audioElement.current.addEventListener('pause', () => {
        console.log("HTML5 Audio - Paused");
        setIsPlaying(false);
      });
      
      audioElement.current.addEventListener('error', (e) => {
        console.error("HTML5 Audio error:", e);
        setIsLoading(false);
        setIsPlaying(false);
        
        // Try fallback URL if available
        if (station.fallbackUrl && station.fallbackUrl !== stationUrl) {
          console.log("Trying fallback URL:", station.fallbackUrl);
          if (audioElement.current) {
            audioElement.current.src = station.fallbackUrl;
            audioElement.current.load();
          }
        } else {
          setStreamError("Failed to load stream. Browser may not support this format.");
          toast.error("Failed to load stream. Try the Force Play button.");
        }
      });
      
      audioElement.current.addEventListener('stalled', () => {
        console.log("HTML5 Audio - Stalled");
        setStreamError("Stream is buffering...");
      });
      
      audioElement.current.addEventListener('waiting', () => {
        console.log("HTML5 Audio - Waiting for data");
        setIsLoading(true);
      });
      
      audioElement.current.addEventListener('progress', () => {
        if (audioElement.current && audioElement.current.buffered.length > 0) {
          setIsLoading(false);
          setStreamError(null);
        }
      });
      
      // Load the audio
      audioElement.current.load();
      
    } catch (error) {
      console.error("Error creating HTML5 Audio:", error);
      setIsLoading(false);
      setStreamError("Failed to initialize HTML5 audio player");
    }
  }, []);

  return {
    initializeHtmlAudio
  };
}
