
import { useEffect } from 'react';
import { Howler } from 'howler';

export function useAudioUnlocker(
  audioElement: React.MutableRefObject<HTMLAudioElement | null>
) {
  // Try to unlock audio context on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      console.log("User interaction detected - trying to unlock audio");
      
      // For Howler
      if (Howler.ctx) {
        const audioContext = Howler.ctx;
        if (audioContext.state === "suspended") {
          audioContext.resume().then(() => {
            console.log("AudioContext unlocked by user interaction");
          }).catch(e => {
            console.error("Failed to unlock AudioContext:", e);
          });
        }
      }
      
      // For mobile browsers, try to create a temporary audio context
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const tempContext = new AudioContext();
          if (tempContext.state === "suspended") {
            tempContext.resume().then(() => {
              console.log("Temporary AudioContext resumed");
            }).catch(e => {
              console.error("Failed to resume temporary context:", e);
            });
          }
        }
      } catch (e) {
        console.error("Error creating temporary audio context:", e);
      }
      
      // Create and use a new oscillator (works well for iOS)
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const oscillator = ctx.createOscillator();
          const gain = ctx.createGain();
          
          gain.gain.value = 0.01;
          oscillator.connect(gain);
          gain.connect(ctx.destination);
          
          oscillator.start(0);
          setTimeout(() => oscillator.stop(0), 100);
          
          console.log("Created oscillator to unlock audio context");
        }
      } catch (e) {
        console.error("Error creating oscillator:", e);
      }
      
      // Try with silent audio element
      try {
        const audio = new Audio();
        audio.volume = 0.01;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Silent audio played successfully");
            setTimeout(() => audio.pause(), 100);
          }).catch(e => {
            console.log("Silent audio failed:", e);
          });
        }
      } catch (e) {
        console.error("Error with silent audio:", e);
      }
      
      // For HTML5 Audio
      if (audioElement.current && audioElement.current.paused) {
        const originalSrc = audioElement.current.src;
        const originalVolume = audioElement.current.volume;
        
        // Try to play the current audio
        try {
          const playPromise = audioElement.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("HTML5 Audio played by user interaction");
            }).catch(e => {
              console.log("HTML5 Audio play attempt failed:", e);
            });
          }
        } catch (e) {
          console.error("Error with HTML5 audio play:", e);
        }
      }
    };
    
    // Add event listeners to unlock audio
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    
    // Also try immediately (might work in some browsers)
    unlockAudio();
    
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, [audioElement]);
}
