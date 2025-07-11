import { MutableRefObject } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { loadCurrentStation, preloadAdjacentStations } from './audioLoaders';
import { tryUnlockAllAudioContexts } from '@/hooks/audio/utils/audioContextUnlockUtils';

export function createAudioControls(
  audioState: {
    stations: RadioStation[];
    currentStationIndex: number;
    setCurrentStationIndex: (index: number) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    volume: number;
    setVolume: (volume: number) => void;
    streamError: string | null;
    setStreamError: (error: string | null) => void;
    currentSound: MutableRefObject<Howl | null>;
    nextSound: MutableRefObject<Howl | null>;
    previousSound: MutableRefObject<Howl | null>;
  }
) {
  const {
    stations,
    currentStationIndex,
    setCurrentStationIndex,
    isPlaying,
    setIsPlaying,
    isLoading,
    setIsLoading,
    volume,
    setVolume,
    streamError,
    setStreamError,
    currentSound,
    nextSound,
    previousSound
  } = audioState;

  // Play current station - only play existing audio, don't reinitialize
  const playCurrentStation = () => {
    if (!currentSound.current) {
      setStreamError("No audio source available. Try changing stations.");
      return;
    }
    
    setIsLoading(true);
    currentSound.current.volume(volume / 100);
    currentSound.current.play();
  };
  
  // Pause current station
  const pauseCurrentStation = () => {
    if (currentSound.current) {
      currentSound.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Toggle play/pause - won't initialize audio if not available
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseCurrentStation();
    } else {
      playCurrentStation();
    }
  };
  
  // Play next station
  const playNextStation = () => {
    const nextIndex = (currentStationIndex + 1) % stations.length;
    setCurrentStationIndex(nextIndex);
    
    // Stop current audio
    if (currentSound.current) {
      currentSound.current.unload();
    }
    
    // Use preloaded next audio if available
    if (nextSound.current) {
      currentSound.current = nextSound.current;
      nextSound.current = null;
      
      // Set volume and play
      if (currentSound.current) {
        setIsLoading(true);
        currentSound.current.volume(volume / 100);
        currentSound.current.play();
      }
    } else {
      // Load and play if preloaded audio isn't available
      loadCurrentStation(
        stations[nextIndex],
        volume,
        currentSound,
        setIsLoading,
        setStreamError,
        setIsPlaying
      );
      if (currentSound.current) {
        setIsLoading(true);
        currentSound.current.play();
      }
    }
    
    // Preload new adjacent stations
    setTimeout(() => preloadAdjacentStations(stations, nextIndex, nextSound, previousSound), 500);
  };
  
  // Play previous station
  const playPreviousStation = () => {
    const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
    setCurrentStationIndex(prevIndex);
    
    // Stop current audio
    if (currentSound.current) {
      currentSound.current.unload();
    }
    
    // Use preloaded previous audio if available
    if (previousSound.current) {
      currentSound.current = previousSound.current;
      previousSound.current = null;
      
      // Set volume and play
      if (currentSound.current) {
        setIsLoading(true);
        currentSound.current.volume(volume / 100);
        currentSound.current.play();
      }
    } else {
      // Load and play if preloaded audio isn't available
      loadCurrentStation(
        stations[prevIndex],
        volume,
        currentSound,
        setIsLoading,
        setStreamError,
        setIsPlaying
      );
      if (currentSound.current) {
        setIsLoading(true);
        currentSound.current.play();
      }
    }
    
    // Preload new adjacent stations
    setTimeout(() => preloadAdjacentStations(stations, prevIndex, nextSound, previousSound), 500);
  };
  
  // Set volume
  const setVolumeHandler = (newVolume: number) => {
    setVolume(newVolume);
    if (currentSound.current) {
      currentSound.current.volume(newVolume / 100);
    }
  };
  
  // Force try play (for mobile devices)
  const forceTryPlay = async () => {
    setIsLoading(true);
    
    try {
      // Try to unlock audio context first
      await tryUnlockAllAudioContexts();
      
      if (currentSound.current) {
        // Try to force play
        currentSound.current.play();
      } else {
        // Load and play if no sound exists
        loadCurrentStation(
          stations[currentStationIndex],
          volume,
          currentSound,
          setIsLoading,
          setStreamError,
          setIsPlaying
        );
        if (currentSound.current) {
          currentSound.current.play();
        }
      }
    } catch (error) {
      console.error("Force play failed:", error);
      setIsLoading(false);
      setStreamError("Force play failed. Try again or refresh the page.");
    }
  };
  
  // Get current station name
  const getCurrentStationName = () => {
    return stations[currentStationIndex].name;
  };

  return {
    playCurrentStation,
    pauseCurrentStation,
    togglePlayPause,
    playNextStation,
    playPreviousStation,
    setVolume: setVolumeHandler,
    forceTryPlay,
    getCurrentStationName
  };
}
