
import { useRef } from 'react';

export function useForcePlayDebounce() {
  const forcePlayInProgressRef = useRef(false);
  const lastForcePlayAttemptRef = useRef(0);
  const forcePlayCooldown = 2000; // 2 second cooldown
  
  const canAttemptForcePlay = () => {
    const now = Date.now();
    
    // Check if we're still in cooldown
    if (now - lastForcePlayAttemptRef.current < forcePlayCooldown) {
      console.log("Force play is in cooldown, please wait");
      return false;
    }
    
    // Check if there's already an attempt in progress
    if (forcePlayInProgressRef.current) {
      console.log("Force play already in progress");
      return false;
    }
    
    return true;
  };
  
  const setForcePlayInProgress = (inProgress: boolean) => {
    forcePlayInProgressRef.current = inProgress;
    
    if (inProgress) {
      lastForcePlayAttemptRef.current = Date.now();
    }
  };
  
  const resetForcePlayFlag = () => {
    forcePlayInProgressRef.current = false;
  };
  
  return {
    canAttemptForcePlay,
    setForcePlayInProgress,
    resetForcePlayFlag
  };
}
