
import { Howl } from 'howler';
import { useCallback } from 'react';

export function useAudioCleanup() {
  // Function to clean up audio resources
  const cleanupAudio = useCallback((
    sound: React.MutableRefObject<Howl | null>,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    setIsPlaying: (isPlaying: boolean) => void,
    setIsLoading: (isLoading: boolean) => void,
    resetRetryCount: () => void
  ) => {
    console.log("Cleaning up audio resources");
    
    // Clean up Howler
    if (sound.current) {
      console.log("Unloading Howler sound");
      sound.current.unload();
      sound.current = null;
    }
    
    // Clean up HTML5 Audio
    if (audioElement.current) {
      console.log("Cleaning up HTML5 Audio");
      audioElement.current.pause();
      audioElement.current.removeAttribute('src');
      audioElement.current.load();
      audioElement.current = null;
    }
    
    // Reset state
    setIsPlaying(false);
    setIsLoading(false);
    resetRetryCount();
  }, []);
  
  return { cleanupAudio };
}
