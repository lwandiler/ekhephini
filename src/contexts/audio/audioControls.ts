
import { MutableRefObject } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { useHlsPlayer } from '@/hooks/audio/useHlsPlayer';
import { tryUnlockAllAudioContexts } from '@/hooks/audio/utils/audioContextUnlockUtils';
import { analyticsService } from '@/services/analyticsService';

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

  // Initialize HLS player for current station
  const currentStation = stations[currentStationIndex];
  const hlsPlayer = useHlsPlayer({
    station: currentStation,
    volume,
    setIsPlaying,
    setIsLoading,
    setStreamError
  });

  // Initialize HLS player when station changes
  const initializeCurrentStation = () => {
    // Clean up Howler instances if they exist
    if (currentSound.current) {
      currentSound.current.unload();
      currentSound.current = null;
    }
    
    hlsPlayer.initializeHlsPlayer();
  };

  // Play current station
  const playCurrentStation = () => {
    if (!hlsPlayer.audioElement) {
      initializeCurrentStation();
      setTimeout(() => hlsPlayer.play(), 500);
    } else {
      hlsPlayer.play();
    }
    
    // Track play event
    analyticsService.trackListeningEvent({
      event_type: 'play',
      station_name: currentStation?.name || 'Unknown Station'
    });
  };
  
  // Pause current station
  const pauseCurrentStation = () => {
    hlsPlayer.pause();
    
    // Track pause event
    analyticsService.trackListeningEvent({
      event_type: 'pause',
      station_name: currentStation?.name || 'Unknown Station'
    });
  };
  
  // Toggle play/pause
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
    
    // Clean up current audio
    if (currentSound.current) {
      currentSound.current.unload();
    }
    
    // Initialize will happen automatically via useEffect in the hook
  };
  
  // Play previous station
  const playPreviousStation = () => {
    const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
    setCurrentStationIndex(prevIndex);
    
    // Clean up current audio
    if (currentSound.current) {
      currentSound.current.unload();
    }
    
    // Initialize will happen automatically via useEffect in the hook
  };
  
  // Set volume
  const setVolumeHandler = (newVolume: number) => {
    setVolume(newVolume);
    hlsPlayer.setVolumeLevel(newVolume);
  };
  
  // Force try play (for mobile devices)
  const forceTryPlay = async () => {
    setIsLoading(true);
    
    try {
      // Try to unlock audio context first
      await tryUnlockAllAudioContexts();
      
      if (!hlsPlayer.audioElement) {
        initializeCurrentStation();
        setTimeout(() => hlsPlayer.play(), 500);
      } else {
        hlsPlayer.play();
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
