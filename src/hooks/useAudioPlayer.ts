
import { useAudioPlayerCore } from './audio/useAudioPlayerCore';
import { AudioPlayerProps, AudioPlayerReturn } from './audio/types';
import { useEffect } from 'react';
import { tryUnlockAllAudioContexts } from './audio/utils/audioContextUnlockUtils';
import { toast } from 'sonner';

export function useAudioPlayer(props: AudioPlayerProps): AudioPlayerReturn {
  // Initialize audio player core
  const playerCore = useAudioPlayerCore(props);
  
  // On first render, try to unlock audio contexts
  useEffect(() => {
    const unlockAudio = async () => {
      console.log("Attempting to unlock audio from useAudioPlayer");
      
      try {
        await tryUnlockAllAudioContexts();
        
        // Show a toast to inform the user that they need to interact with the page
        toast.success("Audio Player Ready - Click the play button to start listening.");
      } catch (error) {
        console.error("Error unlocking audio:", error);
      }
    };
    
    unlockAudio();
  }, []);
  
  return playerCore;
}
