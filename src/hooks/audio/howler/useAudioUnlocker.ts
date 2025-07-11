
import { useCallback } from 'react';
import { Howler } from 'howler';

export function useAudioUnlocker() {
  const unlockAudioForBrowsers = useCallback(() => {
    console.log("Attempting to unlock audio for browsers");
    
    // Try to unlock audio context immediately
    const unlockAudio = () => {
      try {
        // Try to resume Howler's context if suspended
        if (Howler.ctx && Howler.ctx.state === "suspended") {
          Howler.ctx.resume().then(() => {
            console.log("AudioContext resumed by unlock function");
          }).catch(e => console.error("Failed to resume Howler context:", e));
        }
        
        // Try to create and resume a new AudioContext
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
              console.log("New AudioContext resumed");
            }).catch(e => console.error("Failed to resume new context:", e));
          }
          
          // Create and play a silent audio element
          const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgAAQADAQIRAQIRAf/EAHMAAQEBAQEBAAAAAAAAAAECAAUHBgMBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEQMRAD8A8hAAAAAEAEAf/9k=");
          silentAudio.volume = 0.01;
          silentAudio.play().then(() => {
            console.log("Silent audio played successfully");
            setTimeout(() => silentAudio.pause(), 1000);
          }).catch(e => console.log("Silent audio failed:", e));
        }
      } catch (e) {
        console.log("Error during audio unlock attempt:", e);
      }
    };
    
    unlockAudio();
    
    // Also set up event listeners for user interaction to help unlock audio
    const unlockOnInteraction = () => {
      console.log("Interaction detected, trying to unlock audio");
      unlockAudio();
    };
    
    document.addEventListener('touchstart', unlockOnInteraction, { once: true });
    document.addEventListener('click', unlockOnInteraction, { once: true });
    document.addEventListener('keydown', unlockOnInteraction, { once: true });
    
    // Remove these listeners after a timeout
    setTimeout(() => {
      document.removeEventListener('touchstart', unlockOnInteraction);
      document.removeEventListener('click', unlockOnInteraction);
      document.removeEventListener('keydown', unlockOnInteraction);
    }, 5000);
  }, []);
  
  return { unlockAudioForBrowsers };
}
