
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export function useFallbackMode(hasErrors = false) {
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Effect to handle auto-switching to fallback when errors occur
  useEffect(() => {
    if (hasErrors && !fallbackMode) {
      console.log("Errors detected, suggesting fallback mode");
      toast.info("Playback issues detected. Try the fallback mode for better compatibility.");
    }
  }, [hasErrors, fallbackMode]);
  
  // Switch to fallback mode function
  const switchToFallbackMode = useCallback(() => {
    if (!fallbackMode) {
      console.log("Switching to fallback mode");
      setFallbackMode(true);
      toast.success("Switched to HTML5 Audio fallback mode");
    } else {
      console.log("Already in fallback mode");
      toast.info("Already using fallback player mode");
    }
  }, [fallbackMode]);
  
  // Handle errors function (added for compatibility with Lovable)
  const handleError = useCallback(() => {
    if (!fallbackMode) {
      console.log("Error occurred, switching to fallback mode");
      setFallbackMode(true);
      toast.info("Switching to fallback mode due to playback error");
    }
  }, [fallbackMode]);
  
  return { 
    fallbackMode,
    setFallbackMode,
    switchToFallbackMode,
    handleError
  };
}
