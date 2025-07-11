
import { useCallback } from 'react';
import { Howler } from 'howler';

export function useAudioContextUnlocker() {
  const unlockAudioContext = useCallback(async () => {
    console.log("Attempting to unlock audio context");
    
    // First try to use Howler's context
    const audioContext = Howler.ctx;
    if (audioContext && audioContext.state === "suspended") {
      console.log("Resuming suspended Howler audio context");
      try {
        await audioContext.resume();
        console.log("Successfully resumed Howler audio context");
        return true;
      } catch (err) {
        console.error("Failed to resume Howler context:", err);
      }
    } else if (audioContext) {
      console.log("Howler audio context is already in state:", audioContext.state);
      return audioContext.state === "running";
    }
    
    // If that fails, try creating a new context
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        console.log("Created new audio context, state:", ctx.state);
        
        if (ctx.state === "suspended") {
          console.log("Resuming new audio context");
          try {
            await ctx.resume();
            console.log("Successfully resumed new audio context");
            return true;
          } catch (err) {
            console.error("Failed to resume new context:", err);
          }
        } else {
          return ctx.state === "running";
        }
      }
    } catch (e) {
      console.error("Error creating new audio context:", e);
    }
    
    return false;
  }, []);
  
  return { unlockAudioContext };
}
