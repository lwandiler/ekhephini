
import { useCallback } from 'react';
import { Howl, Howler } from 'howler';
import { toast } from 'sonner';
import { RadioStation } from './types';

export function useHowlerPlayer() {
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
    
    // Get the station URL - check if it exists
    const stationUrl = stations[currentStation].url;
    
    // If no stream URL is available, don't initialize and stop loading
    if (!stationUrl) {
      console.log("No stream URL available, stopping Howler initialization");
      setIsLoading(false);
      setStreamError("Stream offline");
      setIsPlaying(false);
      return;
    }
    
    console.log("Creating new Howl instance for URL:", stationUrl);
    
    try {
      // First, try to forcibly unlock the AudioContext
      console.log("Trying to unlock AudioContext before initialization");
      const unlockAudio = () => {
        // Create and play a short silent sound to unlock the AudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          
          // Only resume if suspended
          if (audioContext.state === "suspended") {
            console.log("Resuming suspended AudioContext");
            audioContext.resume().catch(e => console.error("Failed to resume context:", e));
          }
          
          // Create silent oscillator
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          gainNode.gain.value = 0.01; // Almost silent
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.start(0);
          oscillator.stop(0.1);
        }
        
        // Also try to force Howler context
        if (Howler.ctx && Howler.ctx.state === "suspended") {
          console.log("Resuming Howler context");
          Howler.ctx.resume().catch(e => console.error("Failed to resume Howler context:", e));
        }
      };
      
      unlockAudio();
      
      // Clean up previous instance
      if (sound.current) {
        sound.current.unload();
      }

      // Create a new instance with autoplay enabled
      sound.current = new Howl({
        src: [stationUrl],
        html5: true, // Required for streaming audio
        format: ['mp3'], 
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
          
          // No fallback URL - only retry with primary URL
          if (retryCount.current < maxRetries) {
            retryCount.current += 1;
            console.log(`Retry attempt ${retryCount.current}/${maxRetries}`);
            
            setTimeout(() => {
              if (sound.current) {
                sound.current.unload();
                sound.current = null;
              }
              
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
            }, 2000); // Wait 2 seconds before retry
            
            toast.info(`Stream connection issue. Retrying... (${retryCount.current}/${maxRetries})`);
          } else {
            setIsPlaying(false);
            setStreamError("Stream failed to load.");
            toast.error("Unable to connect to stream.");
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
  }, []);
  
  // Unlock audio context
  const unlockAudioContext = useCallback(() => {
    console.log("Attempting to unlock audio context");
    
    // First try to use Howler's context
    const audioContext = Howler.ctx;
    if (audioContext && audioContext.state === "suspended") {
      console.log("Resuming suspended Howler audio context");
      return audioContext.resume();
    }
    
    // If that fails, try creating a new context
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === "suspended") {
          console.log("Resuming new audio context");
          return ctx.resume();
        }
      }
    } catch (e) {
      console.error("Error creating new audio context:", e);
    }
    
    return Promise.resolve();
  }, []);

  return {
    initializeHowlerAudio,
    unlockAudioContext
  };
}
