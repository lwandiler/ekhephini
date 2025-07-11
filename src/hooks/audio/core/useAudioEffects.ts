
import { useEffect, useCallback } from 'react';
import { Howler } from 'howler';
import { AudioPlayerState } from './types';
import { RadioStation } from '../types';
import { toast } from 'sonner';
import { tryUnlockAllAudioContexts } from '../utils/audioContextUnlockUtils';

export function useAudioEffects(
  state: AudioPlayerState,
  stations: RadioStation[]
) {
  const {
    isPlaying,
    fallbackMode,
    currentStation,
    sound,
    audioElement,
    retryCount,
    isInitialized,
    autoInitialize
  } = state;

  // Function to reset retry counter
  const resetRetryCount = useCallback(() => {
    retryCount.current = 0;
  }, [retryCount]);

  // Effect to handle initialization
  useEffect(() => {
    console.log("Audio effects initializing, auto initialize:", autoInitialize);
    
    // Try to unlock audio context
    const unlockAudio = async () => {
      await tryUnlockAllAudioContexts();
    };
    
    // Run this when component mounts
    unlockAudio();
    
    // Set up event listeners to help unlock audio
    const handleInteraction = () => {
      console.log("User interaction detected");
      unlockAudio();
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [autoInitialize]);

  // Debug logging for playback status changes
  useEffect(() => {
    console.log(`Playback state changed: ${isPlaying ? 'Playing' : 'Paused'}`);

    // When playback starts, show toast to confirm
    if (isPlaying) {
      const stationName = stations[currentStation]?.name || 'Unknown Station';
      toast.success(`Now playing: ${stationName}`);

      // Also try to unlock any suspended AudioContext
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        console.log("Resuming suspended Howler context on play state change");
        Howler.ctx.resume().catch(e => console.error("Failed to resume Howler context:", e));
      }
    }
  }, [isPlaying, currentStation, stations]);

  // Track and log station changes
  useEffect(() => {
    console.log(`Station changed to: ${stations[currentStation]?.name}`);
    
    // Reset retry counter when station changes
    resetRetryCount();
  }, [currentStation, stations, resetRetryCount]);

  // Handle changes to fallback mode
  useEffect(() => {
    const modeName = fallbackMode ? 'HTML5 Audio' : 'Howler';
    console.log(`Audio mode changed to: ${modeName}`);
    
    // Reset retry counter when mode changes
    resetRetryCount();
  }, [fallbackMode, resetRetryCount]);

  // Clean up resources on component unmount
  useEffect(() => {
    return () => {
      console.log("Cleaning up audio resources");
      
      if (sound.current) {
        sound.current.unload();
      }
      
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.src = '';
      }
    };
  }, [sound, audioElement]);

  return { resetRetryCount };
}
