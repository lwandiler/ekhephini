
/**
 * Attempts to unlock audio contexts across different browsers
 * This is particularly important for mobile devices
 */
export const tryUnlockAllAudioContexts = async (): Promise<void> => {
  console.log("Attempting to unlock all audio contexts");
  
  try {
    // Try to access and resume the AudioContext
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    
    if (AudioContext) {
      const audioContext = new AudioContext();
      
      // Create a short, silent buffer
      if (audioContext.state === "suspended") {
        console.log("Audio context is suspended, attempting to resume");
        await audioContext.resume();
        console.log("Audio context resume attempt completed");
      } else {
        console.log("Audio context is already running:", audioContext.state);
      }
      
      // Create and play a short silence to help unlock audio on iOS
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      
      console.log("Silent buffer played to help unlock audio");
      
      // For iOS, create oscillator as well
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.01; // Almost silent
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(0);
      oscillator.stop(0.1);
    } else {
      console.log("AudioContext not available in this browser");
    }
  } catch (error) {
    console.error("Error unlocking audio context:", error);
  }
  
  // Also try to create and play a silent HTML5 audio element with better format support
  try {
    // Use a valid, widely-supported silent MP3 instead of a data URI
    const silentAudio = new Audio();
    silentAudio.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    silentAudio.volume = 0.1;
    
    // Wait for canplaythrough event then try to play
    await new Promise<void>((resolve, reject) => {
      silentAudio.oncanplaythrough = () => {
        console.log("Silent HTML5 audio can play through");
        silentAudio.play()
          .then(() => {
            console.log("Silent HTML5 audio played successfully");
            setTimeout(() => {
              silentAudio.pause();
              resolve();
            }, 500);
          })
          .catch(err => {
            console.log("Silent HTML5 audio play attempt failed:", err);
            reject(err);
          });
      };
      
      silentAudio.onerror = (e) => {
        console.log("Silent HTML5 audio error:", e);
        reject(new Error("Silent audio load error"));
      };
      
      // Set timeout to avoid hanging
      setTimeout(() => {
        try {
          silentAudio.play()
            .then(() => {
              console.log("Silent HTML5 audio played on timeout");
              setTimeout(() => {
                silentAudio.pause();
                resolve();
              }, 300);
            })
            .catch(err => {
              console.log("Silent HTML5 audio play attempt on timeout failed:", err);
              reject(err);
            });
        } catch (e) {
          console.log("Could not play silent audio on timeout:", e);
          reject(e);
        }
      }, 1000);
    });
  } catch (error) {
    console.log("Silent HTML5 audio attempt failed:", error);
  }
};
