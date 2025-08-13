import { useCallback } from 'react';
import { RadioStation } from '../types';
import { AudioPlayerState } from './types';
import { toast } from 'sonner';

export function useAudioControlHandlers(
  state: AudioPlayerState,
  stations: RadioStation[]
) {
  const {
    sound,
    audioElement,
    isPlaying,
    fallbackMode,
    currentStation,
    volume,
    setIsPlaying,
    setIsLoading,
    setStreamError,
    setCurrentStation,
    retryCount,
    isInitialized
  } = state;
  
  // Toggle playback state
  const togglePlayPause = useCallback(() => {
    console.log("Toggle play/pause called, current state:", isPlaying);
    
    // Check if stream URL is available first
    const streamUrl = stations[currentStation]?.streamUrl || stations[currentStation]?.url;
    if (!streamUrl) {
      console.log("No stream URL available, stopping toggle");
      setIsLoading(false);
      setStreamError("Stream offline");
      setIsPlaying(false);
      return;
    }
    
    // If nothing is initialized yet, we can't play anything
    if (!isInitialized.current) {
      console.log("Audio not initialized yet, can't play");
      setStreamError("Audio player not initialized yet. Please wait...");
      return;
    }
    
    if (fallbackMode && audioElement.current) {
      if (isPlaying) {
        console.log("Fallback mode: Pausing audio");
        audioElement.current.pause();
        setIsPlaying(false);
      } else {
        console.log("Fallback mode: Playing audio");
        setIsLoading(true);
        
        // Check if audio element has a source before playing
        if (!audioElement.current.src) {
          console.log("No audio source available, can't play");
          setIsLoading(false);
          setStreamError("No audio source available");
          return;
        }
        
        const playPromise = audioElement.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Fallback mode: Play successful");
              setIsPlaying(true);
              setIsLoading(false);
              toast.success(`Now playing: ${stations[currentStation].name}`);
            })
            .catch(error => {
              console.error("Error playing HTML5 audio:", error);
              setIsLoading(false);
              setStreamError("Failed to play. Try the Force Play button.");
            });
        }
      }
    } else if (sound.current) {
      if (isPlaying) {
        console.log("Howler mode: Pausing audio");
        sound.current.pause();
        setIsPlaying(false);
      } else {
        console.log("Howler mode: Playing audio");
        setIsLoading(true);
        
        // Try to resume audio context first
        try {
          if (sound.current._sounds && sound.current._sounds[0] && sound.current._sounds[0]._node) {
            const audioContext = sound.current._sounds[0]._node.context;
            if (audioContext && audioContext.state === "suspended") {
              audioContext.resume().catch(e => console.error("Failed to resume Howler context:", e));
            }
          }
        } catch (e) {
          console.error("Error accessing Howler context:", e);
        }
        
        sound.current.play();
        
        // Handle case where play() might not trigger onplay callback
        setTimeout(() => {
          if (sound.current && !sound.current.playing()) {
            console.log("Play didn't start after timeout");
            setIsLoading(false);
            setStreamError("Playback failed. Try the Force Play button.");
          }
        }, 3000);
      }
    } else {
      console.warn("No audio element available to toggle playback");
      setStreamError("No audio source available. Try changing stations.");
    }
  }, [
    isInitialized,
    fallbackMode,
    audioElement,
    sound,
    isPlaying,
    setIsPlaying,
    setIsLoading,
    setStreamError,
    currentStation,
    stations
  ]);

  // Force try to play audio
  const forceTryPlay = useCallback(() => {
    console.log("Force try play called");
    
    // Set initialized flag if needed
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
    
    setIsLoading(true);
    
    try {
      if (fallbackMode && audioElement.current) {
        // Try to unlock audio context first
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            if (audioContext.state === "suspended") {
              audioContext.resume().catch(e => console.error("Failed to resume context:", e));
            }
          }
        } catch (e) {
          console.error("Error accessing AudioContext:", e);
        }
        
        const playPromise = audioElement.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
              setStreamError(null);
            })
            .catch(error => {
              console.error("Error in force play HTML5 audio:", error);
              setIsLoading(false);
              setStreamError("Browser blocked autoplay. Try opening in browser.");
            });
        }
      } else if (sound.current) {
        // For Howler, try to resume audio context first
        try {
          if (sound.current._sounds && sound.current._sounds[0] && sound.current._sounds[0]._node) {
            const audioContext = sound.current._sounds[0]._node.context;
            if (audioContext && audioContext.state === "suspended") {
              audioContext.resume().catch(e => console.error("Failed to resume Howler context:", e));
            }
          }
        } catch (e) {
          console.error("Error accessing Howler context:", e);
        }
        
        sound.current.play();
      }
    } catch (error) {
      console.error("Error in forceTryPlay:", error);
      setIsLoading(false);
      setStreamError("Error trying to force play");
    }
  }, [
    audioElement,
    sound,
    fallbackMode,
    setIsPlaying,
    setIsLoading,
    setStreamError,
    isInitialized
  ]);
  
  // Handle volume changes
  const handleVolumeChange = useCallback((newVolume: number[]) => {
    if (sound.current) {
      sound.current.volume(newVolume[0] / 100);
    }
    
    if (audioElement.current) {
      audioElement.current.volume = newVolume[0] / 100;
    }
  }, [sound, audioElement]);
  
  // Change radio station
  const changeStation = useCallback((direction: 'next' | 'prev') => {
    // Set initialized flag if needed
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
    
    setIsLoading(true);
    setStreamError(null);
    
    // Reset retry counter
    retryCount.current = 0;
    
    // Calculate new station index
    const totalStations = stations.length;
    let newStation = currentStation;
    
    if (direction === 'next') {
      newStation = (currentStation + 1) % totalStations;
    } else {
      newStation = (currentStation - 1 + totalStations) % totalStations;
    }
    
    // Update station
    setCurrentStation(newStation);
  }, [
    currentStation,
    stations,
    setCurrentStation,
    setIsLoading,
    setStreamError,
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
