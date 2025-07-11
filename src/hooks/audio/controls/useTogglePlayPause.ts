
import { Howl } from 'howler';
import { toast } from 'sonner';
import { RadioStation } from '../types';

export function useTogglePlayPause() {
  const togglePlayPause = (
    isPlaying: boolean,
    fallbackMode: boolean,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    sound: React.MutableRefObject<Howl | null>,
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    initializeHtmlAudio: Function,
    initializeHowlerAudio: Function,
    unlockAudioContext: Function,
    retryCount: React.MutableRefObject<number>,
    maxRetries: number
  ) => {
    // Always try to unlock audio context first
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log("AudioContext resumed during toggle");
          }).catch(e => console.error("Failed to resume context during toggle:", e));
        }
      }
    } catch (e) {
      console.error("Error accessing AudioContext during toggle:", e);
    }
    
    if (fallbackMode) {
      if (!audioElement.current) {
        console.log("No HTML5 Audio element, initializing");
        initializeHtmlAudio(
          currentStation, 
          stations, 
          volume, 
          setIsPlaying, 
          setIsLoading, 
          setStreamError, 
          audioElement
        );
        return; // Don't continue with toggle since we're initializing
      }
      
      if (audioElement.current) {
        if (isPlaying) {
          console.log("HTML5 Audio - Pausing playback");
          audioElement.current.pause();
          setIsPlaying(false);
        } else {
          console.log("HTML5 Audio - Attempting to play");
          setIsLoading(true);
          setStreamError(null); // Clear any previous errors
          
          // Make sure the source is set
          if (!audioElement.current.src || audioElement.current.src === '') {
            const stationUrl = stations[currentStation].fallbackUrl || stations[currentStation].url;
            console.log(`HTML5 Audio - Setting source to ${stationUrl}`);
            audioElement.current.src = stationUrl;
            audioElement.current.load();
          }
          
          audioElement.current.play().then(() => {
            console.log("HTML5 Audio - Play successful");
            setIsPlaying(true);
            setIsLoading(false);
            toast.success(`Now playing: ${stations[currentStation].name}`);
          }).catch(error => {
            console.error("Error playing HTML5 Audio:", error);
            setIsLoading(false);
            setStreamError("Browser blocked audio playback. Try the Force Play button.");
            
            // Try alternative URL
            if (stations[currentStation].fallbackUrl && audioElement.current) {
              console.log("HTML5 Audio - Trying fallback URL as last resort");
              audioElement.current.src = stations[currentStation].fallbackUrl;
              audioElement.current.load();
              audioElement.current.play().catch(err => {
                console.error("Fallback URL also failed:", err);
                toast.error("Audio playback blocked. Try clicking the Force Play button.");
              });
            } else {
              toast.error("Audio playback blocked. Try clicking the Force Play button.");
            }
          });
        }
      }
    } else {
      if (!sound.current) {
        console.log("No Howl instance, initializing");
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
        return; // Don't continue with toggle since we're initializing
      }
      
      if (sound.current) {
        if (isPlaying) {
          console.log("Howl - Pausing playback");
          sound.current.pause();
          setIsPlaying(false);
        } else {
          console.log("Howl - Attempting to play");
          setIsLoading(true);
          setStreamError(null); // Clear any previous errors
          
          // Try to resume the AudioContext first
          unlockAudioContext().then(() => {
            console.log("Howl - AudioContext unlocked, playing");
            if (sound.current) {
              sound.current.play();
              // Add a fallback if play doesn't update state
              setTimeout(() => {
                if (sound.current && !sound.current?.playing()) {
                  console.log("Howl - Play didn't start after timeout");
                  setIsLoading(false);
                  setStreamError("Playback failed. Try the Force Play button.");
                }
              }, 3000);
            }
          }).catch(error => {
            console.error("Failed to resume AudioContext:", error);
            setStreamError("Browser blocked audio playback. Try the Force Play button.");
            setIsLoading(false);
            
            // Try reinitializing completely
            if (sound.current) {
              sound.current.unload();
              sound.current = null;
            }
            
            toast.info("Reinitializing audio player...");
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
          });
        }
      }
    }
  };

  return { togglePlayPause };
}
