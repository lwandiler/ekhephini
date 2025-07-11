
import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { AudioPlayerProps } from '../types';

export function useAudioPlayerState({ 
  initialVolume = 80,
  fallbackMode = false,
  autoInitialize = true 
}: Pick<AudioPlayerProps, 'initialVolume' | 'fallbackMode' | 'autoInitialize'>) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStation, setCurrentStation] = useState(0);
  const [streamError, setStreamError] = useState<string | null>(null);
  
  // Audio references
  const sound = useRef<Howl | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const retryCount = useRef(0);
  const isInitialized = useRef(autoInitialize); // Set initial state based on autoInitialize
  
  // Effect to handle automatic initialization if needed
  useEffect(() => {
    if (autoInitialize) {
      console.log("Auto-initialization enabled");
      isInitialized.current = true;
    } else {
      console.log("Auto-initialization disabled, waiting for user interaction");
    }
  }, [autoInitialize]);

  return {
    // Player state
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isLoading,
    setIsLoading,
    currentStation,
    setCurrentStation,
    streamError,
    setStreamError,
    
    // Audio references
    sound,
    audioElement,
    retryCount,
    isInitialized,
    
    // Configuration
    fallbackMode,
    autoInitialize
  };
}
