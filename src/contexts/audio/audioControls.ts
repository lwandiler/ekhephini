
import { MutableRefObject, useEffect } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { useHlsPlayer } from '@/hooks/audio/useHlsPlayer';
import { tryUnlockAllAudioContexts } from '@/hooks/audio/utils/audioContextUnlockUtils';
// Analytics service removed for now

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
    currentPodcast: { name: string; thumbnailUrl?: string | null } | null;
    setCurrentPodcast: (p: { name: string; thumbnailUrl?: string | null } | null) => void;
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
    previousSound,
    currentPodcast,
    setCurrentPodcast
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

  // Reinitialize player when the current station source changes (e.g., DB settings loaded)
  useEffect(() => {
    hlsPlayer.initializeHlsPlayer();
    if (isPlaying) {
      hlsPlayer.play();
    }
  }, [currentStation?.url, (currentStation as any)?.streamUrl]);

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
    // Clear any podcast override when switching to live
    setCurrentPodcast(null);
    if (!hlsPlayer.getAudioElement()) {
      initializeCurrentStation();
    }
    hlsPlayer.play();
    // Analytics tracking - disabled for now
  };
  
  // Pause current station
  const pauseCurrentStation = () => {
    hlsPlayer.pause();
    
    // Analytics tracking - disabled for now
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseCurrentStation();
    } else {
      // Use forceTryPlay to ensure audio contexts are unlocked and player initialized
      forceTryPlay();
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
      
      if (!hlsPlayer.getAudioElement()) {
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
    getCurrentStationName,
    playExternalUrl: (name: string, url: string, thumbnailUrl?: string | null) => {
      setCurrentPodcast({ name, thumbnailUrl: thumbnailUrl ?? undefined });
      return hlsPlayer.playExternalUrl(name, url);
    }
  };
}
