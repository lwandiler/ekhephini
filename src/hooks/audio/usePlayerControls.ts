import { useCallback } from 'react';
import { Howl } from 'howler';
import { RadioStation } from './types';
import { toast } from 'sonner';
import { useForceTryPlay } from './controls/useForceTryPlay';

export function usePlayerControls() {
  // Import forceTryPlay functionality
  const { forceTryPlay: forceTryPlayHandler } = useForceTryPlay();

  // Toggle playback state
  const togglePlayPause = useCallback((
    isPlaying: boolean,
    fallbackMode: boolean,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    sound: React.MutableRefObject<Howl | null>,
    currentStation: number,
    stations: RadioStation[],
    volume: number,
    setIsPlaying: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    initializeHtmlAudio: Function,
    initializeHowlerAudio: Function,
    unlockAudioContext: Function,
    retryCount: React.MutableRefObject<number>,
    maxRetries: number
  ) => {
    // Always try to unlock audio context first
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log("AudioContext resumed during toggle");
          }).catch(e => console.error("Failed to resume context during toggle:", e));
        }
      }
    } catch (e) {
      console.error("Error accessing AudioContext during toggle:", e);
    }
    
    // Only use existing audio elements - don't initialize
    if (fallbackMode) {
      if (!audioElement.current || !audioElement.current.src) {
        console.log("HTML5 Audio - No audio source available");
        setStreamError("No audio source available. Try changing stations.");
        return;
      }
      
      if (audioElement.current) {
        if (isPlaying) {
          console.log("HTML5 Audio - Pausing playback");
          audioElement.current.pause();
          setIsPlaying(false);
        } else {
          console.log("HTML5 Audio - Attempting to play existing audio");
          setIsLoading(true);
          setStreamError(null); // Clear any previous errors
          
          audioElement.current.play().then(() => {
            console.log("HTML5 Audio - Play successful");
            setIsPlaying(true);
            setIsLoading(false);
            toast.success(`Now playing: ${stations[currentStation].name}`);
          }).catch(error => {
            console.error("Error playing HTML5 Audio:", error);
            setIsLoading(false);
            setStreamError("Browser blocked audio playback. Try the Force Play button.");
          });
        }
      }
    } else {
      if (!sound.current) {
        console.log("No Howl instance available");
        setStreamError("No audio source available. Try changing stations.");
        return;
      }
      
      if (sound.current) {
        if (isPlaying) {
          console.log("Howl - Pausing playback");
          sound.current.pause();
          setIsPlaying(false);
        } else {
          console.log("Howl - Attempting to play existing audio");
          setIsLoading(true);
          setStreamError(null); // Clear any previous errors
          
          // Try to resume the AudioContext first
          unlockAudioContext().then(() => {
            console.log("Howl - AudioContext unlocked, playing");
            if (sound.current) {
              sound.current.play();
              // Add a fallback if play doesn't update state
              setTimeout(() => {
                if (sound.current && !sound.current?.playing()) {
                  console.log("Howl - Play didn't start after timeout");
                  setIsLoading(false);
                  setStreamError("Playback failed. Try the Force Play button.");
                }
              }, 3000);
            }
          }).catch(error => {
            console.error("Failed to resume AudioContext:", error);
            setStreamError("Browser blocked audio playback. Try the Force Play button.");
            setIsLoading(false);
          });
        }
      }
    }
  }, []);

  // Handle volume changes
  const handleVolumeChange = useCallback((
    newVolume: number[],
    setVolume: (volume: number) => void,
    sound: React.MutableRefObject<Howl | null>,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>
  ) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    console.log("Setting volume to:", volumeValue);
    
    // Update Howler volume
    if (sound.current) {
      sound.current.volume(volumeValue / 100);
    }
    
    // Update HTML5 Audio volume
    if (audioElement.current) {
      audioElement.current.volume = volumeValue / 100;
    }
  }, []);
  
  // Change radio station
  const changeStation = useCallback((
    direction: 'next' | 'prev',
    currentStation: number,
    stations: RadioStation[],
    setCurrentStation: (station: number) => void,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    retryCount: React.MutableRefObject<number>
  ) => {
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
  }, []);

  // Return the force try play handler
  const forceTryPlay = useCallback((
    fallbackMode: boolean,
    audioElement: React.MutableRefObject<HTMLAudioElement | null>,
    sound: React.MutableRefObject<Howl | null>,
    setIsLoading: (value: boolean) => void,
    setStreamError: (value: string | null) => void,
    unlockAudioContext: Function
  ) => {
    forceTryPlayHandler(
      fallbackMode,
      audioElement,
      sound,
      setIsLoading,
      setStreamError,
      unlockAudioContext
    );
  }, [forceTryPlayHandler]);

  return {
    togglePlayPause,
    forceTryPlay: forceTryPlayHandler,
    handleVolumeChange,
    changeStation
  };
}
