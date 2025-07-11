
import { Howl } from 'howler';
import { toast } from 'sonner';
import { tryUnlockAllAudioContexts } from '../utils/audioContextUnlockUtils';
import { useForcePlayDebounce } from '../forceTryPlay/useForcePlayDebounce';
import { useHowlerForcePlay } from '../forceTryPlay/useHowlerForcePlay';
import { useHtml5ForcePlay } from '../forceTryPlay/useHtml5ForcePlay';

export function useForceTryPlay() {
  const { canAttemptForcePlay, setForcePlayInProgress, resetForcePlayFlag } = useForcePlayDebounce();
  const { forcePlayHowler } = useHowlerForcePlay();
  const { forcePlayHtml5Audio } = useHtml5ForcePlay();
  
  const forceTryPlay = (
    fallbackMode: boolean,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    sound: React.MutableRefObject<Howl | null>,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    unlockAudioContext: Function
  ) => {
    // Prevent multiple force play attempts concurrently
    if (!canAttemptForcePlay()) {
      return;
    }
    
    // Set the flag to prevent multiple attempts
    setForcePlayInProgress(true);
    
    console.log("Force trying to play audio");
    setIsLoading(true);
    setStreamError(null);
    toast.info("Attempting to force play audio...");
    
    // Try to unlock audio contexts first
    tryUnlockAllAudioContexts().then(() => {
      // Now try the actual playback methods based on mode
      if (fallbackMode && audioElement.current) {
        forcePlayHtml5Audio(audioElement, setIsLoading, setStreamError);
      } else {
        forcePlayHowler(sound, setIsLoading, setStreamError);
      }
    });
    
    // As a last resort, suggest opening in browser and reset the flag
    setTimeout(() => {
      if ((!fallbackMode && sound.current && !sound.current.playing()) || 
          (fallbackMode && audioElement.current && audioElement.current.paused)) {
        setIsLoading(false);
        toast.info("If playback doesn't start, try opening in your browser");
      }
      // Reset the flag after a timeout regardless of success
      resetForcePlayFlag();
    }, 3000);
  };

  return { forceTryPlay };
}
