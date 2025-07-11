
import { useCallback } from 'react';
import { toast } from 'sonner';
import { RadioStation } from './types';

export function useHtmlAudio() {
  // Initialize HTML5 Audio Element
  const initializeHtmlAudio = useCallback((
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    audioElementRef: React.MutableRefObject<HTMLAudioElement | null>
  ) => {
    try {
      console.log("Initializing HTML5 Audio");
      
      // If there's already an audio element, clean it up
      if (audioElementRef.current) {
        console.log("Cleaning up previous HTML5 Audio element");
        audioElementRef.current.pause();
        audioElementRef.current.src = "";
        audioElementRef.current.load();
      }

      // Create a new audio element
      const audio = new Audio();
      
      // Try to unlock audio context immediately
      const unlockAudio = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => console.log("AudioContext resumed by HTML Audio init"));
          
          // Create and play a silent audio element
          const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgAAQADAQIRAQIRAf/EAHMAAQEBAQEBAAAAAAAAAAAAAAECAAUHBgMBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEQMRAD8A8hAAAAAEAEAf/9k=");
          silentAudio.volume = 0.01;
          silentAudio.play().then(() => {
            console.log("Silent audio played successfully");
            setTimeout(() => silentAudio.pause(), 1000);
          }).catch(e => console.log("Silent audio failed:", e));
        }
      };
      
      unlockAudio();
      
      audio.autoplay = true; // Try autoplay
      audio.preload = "auto";
      audio.crossOrigin = "anonymous"; // Try to handle CORS
      
      // Try fallback URL first as it might work better for direct playback
      const stationUrl = stations[currentStation].fallbackUrl || stations[currentStation].url;
      
      console.log("Using HTML5 Audio with URL:", stationUrl);
      audio.src = stationUrl;
      
      audio.oncanplay = () => {
        console.log("HTML Audio can play");
        setIsLoading(false);
        setStreamError(null);
        // Try to play immediately when can play
        audio.play().then(() => {
          console.log("HTML Audio playback started successfully");
        }).catch(err => console.log("Auto play attempt failed:", err));
      };
      
      audio.onplaying = () => {
        console.log("HTML Audio started playing");
        setIsPlaying(true);
        setIsLoading(false);
        setStreamError(null);
        toast.success(`Now playing: ${stations[currentStation].name}`);
      };
      
      audio.onwaiting = () => {
        console.log("HTML Audio waiting for data");
        setIsLoading(true);
      };
      
      audio.onerror = (e) => {
        console.error("HTML Audio error:", e);
        setIsLoading(false);
        setIsPlaying(false);
        
        // Try alternative URL if available
        const alternativeUrl = stations[currentStation].url;
        if (audio.src !== alternativeUrl && alternativeUrl) {
          console.log("Trying alternative URL:", alternativeUrl);
          audio.src = alternativeUrl;
          audio.load();
          audio.play().then(() => {
            console.log("Alternative URL working");
          }).catch(err => {
            console.error("Alternative URL also failed:", err);
            setStreamError("Stream failed to play. Try opening in browser.");
          });
        } else {
          setStreamError("Stream failed to play. Try opening in browser.");
        }
      };
      
      audio.onended = () => {
        console.log("HTML Audio ended");
        setIsPlaying(false);
      };
      
      audio.volume = volume / 100;
      audioElementRef.current = audio;
      
      // Try to play immediately
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("HTML Audio initial play successful");
        }).catch(err => {
          console.log("Initial play attempt failed:", err);
          if (err.name === "NotAllowedError") {
            setStreamError("Browser blocked autoplay. Click play button to start.");
          } else {
            setStreamError("Unable to play stream. Click play button to try again.");
          }
        });
      }
      
      // Try to unlock audio context on iOS/mobile
      const unlockAudioOnInteraction = () => {
        if (audioElementRef.current) {
          audioElementRef.current.play().then(() => {
            console.log("Touch unlock successful");
          }).catch(e => console.log("Touch unlock attempt:", e));
        }
      };
      
      document.addEventListener('touchstart', unlockAudioOnInteraction, { once: true });
      document.addEventListener('click', unlockAudioOnInteraction, { once: true });
      document.addEventListener('keydown', unlockAudioOnInteraction, { once: true });
    } catch (error) {
      console.error("Error initializing HTML Audio:", error);
      setStreamError("Failed to initialize audio player");
    }
  }, []);

  return {
    initializeHtmlAudio
  };
}
