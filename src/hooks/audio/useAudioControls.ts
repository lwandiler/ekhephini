import { useCallback } from 'react';
import { Howl } from 'howler';
import { RadioStation } from './types';
import { usePlayerControls } from './usePlayerControls';
import { useHowlerPlayer } from './howler/useHowlerPlayer';
import { useHtmlAudio } from './useHtmlAudio';
import { useInitialization } from './controls/useInitialization';

interface UseAudioControlsProps {
  sound: React.MutableRefObject<Howl | null>;
  audioElement: React.MutableRefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  fallbackMode: boolean;
  currentStation: number;
  stations: RadioStation[];
  volume: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStreamError: (error: string | null) => void;
  setCurrentStation: (station: number) => void;
  retryCount: React.MutableRefObject<number>;
  isInitialized: React.MutableRefObject<boolean>;
  setVolume: (volume: number) => void;
}

export function useAudioControls({
  sound,
  audioElement,
  isPlaying,
  fallbackMode,
  currentStation,
  stations,
  volume,
  setIsPlaying,
  setIsLoading,
  setStreamError,
  setCurrentStation,
  retryCount,
  isInitialized,
  setVolume
}: UseAudioControlsProps) {
  const maxRetries = 3;
  
  // Import base player controls
  const { togglePlayPause: togglePlayPauseFn, 
          forceTryPlay: forceTryPlayFn, 
          changeStation: changeStationFn,
          handleVolumeChange: handleVolumeChangeFn } = usePlayerControls();
          
  // Import audio initialization utilities
  const { initializeHowlerAudio, unlockAudioContext } = useHowlerPlayer();
  const { initializeHtmlAudio } = useHtmlAudio();
  const { handleInitialization } = useInitialization({
    setIsPlaying,
    setIsLoading,
    setStreamError,
    retryCount,
    maxRetries
  });

  // Toggle playback state
  const togglePlayPause = useCallback(() => {
    // Check for initialization needs
    const needsInitialization = handleInitialization(
      isInitialized,
      fallbackMode,
      currentStation,
      stations,
      volume,
      audioElement,
      sound,
      initializeHtmlAudio,
      initializeHowlerAudio
    );
    
    // If initialization was needed, wait briefly then continue
    if (needsInitialization) {
      setTimeout(() => {
        togglePlayPauseFn(
          isPlaying,
          fallbackMode,
          audioElement,
          sound,
          currentStation,
          stations,
          volume,
          setIsPlaying,
          setIsLoading,
          setStreamError,
          initializeHtmlAudio,
          initializeHowlerAudio,
          unlockAudioContext,
          retryCount,
          maxRetries
        );
      }, 300);
      
      return;
    }
    
    // Otherwise proceed with normal toggle
    togglePlayPauseFn(
      isPlaying,
      fallbackMode,
      audioElement,
      sound,
      currentStation,
      stations,
      volume,
      setIsPlaying,
      setIsLoading,
      setStreamError,
      initializeHtmlAudio,
      initializeHowlerAudio,
      unlockAudioContext,
      retryCount,
      maxRetries
    );
  }, [
    isPlaying, 
    fallbackMode, 
    audioElement,
    sound,
    currentStation, 
    stations, 
    volume, 
    setIsPlaying,
    setIsLoading,
    setStreamError,
    initializeHtmlAudio, 
    initializeHowlerAudio,
    unlockAudioContext,
    togglePlayPauseFn,
    retryCount,
    isInitialized,
    handleInitialization
  ]);
  
  // Force try to play audio
  const forceTryPlay = useCallback(() => {
    // Set initialized flag if needed
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
    
    forceTryPlayFn(
      fallbackMode,
      audioElement,
      sound,
      setIsLoading,
      setStreamError,
      unlockAudioContext
    );
  }, [
    fallbackMode, 
    audioElement,
    sound,
    setIsLoading,
    setStreamError,
    unlockAudioContext, 
    forceTryPlayFn,
    isInitialized
  ]);
  
  // Handle volume changes - fixed implementation
  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const volumeValue = newVolume[0];
    
    // Update volume state
    setVolume(volumeValue);
    
    // Update Howler volume
    if (sound.current) {
      sound.current.volume(volumeValue / 100);
    }
    
    // Update HTML5 Audio volume
    if (audioElement.current) {
      audioElement.current.volume = volumeValue / 100;
    }
  }, [sound, audioElement, setVolume]);
  
  // Change radio station
  const changeStation = useCallback((direction: 'next' | 'prev') => {
    // Set initialized flag if needed
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
    
    changeStationFn(
      direction,
      currentStation,
      stations,
      setCurrentStation,
      setIsLoading,
      setStreamError,
      retryCount
    );
  }, [
    currentStation, 
    stations, 
    setCurrentStation,
    setIsLoading,
    setStreamError,
    changeStationFn,
    retryCount,
    isInitialized
  ]);

  return {
    togglePlayPause,
    forceTryPlay,
    handleVolumeChange,
    changeStation
  };
}
