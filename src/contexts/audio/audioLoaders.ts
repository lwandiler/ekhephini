
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { toast } from 'sonner';
import { MutableRefObject } from 'react';

// Load and setup the current station audio
export function loadCurrentStation(
  station: RadioStation,
  volume: number,
  currentSound: MutableRefObject<Howl | null>,
  setIsLoading: (loading: boolean) => void,
  setStreamError: (error: string | null) => void,
  setIsPlaying: (playing: boolean) => void
) {
  if (currentSound.current) {
    currentSound.current.unload();
  }
  
  setIsLoading(true);
  setStreamError(null);
  
  try {
    currentSound.current = new Howl({
      src: [station.url],
      html5: true,
      autoplay: false,
      volume: volume / 100,
      format: ['mp3'],
      onload: () => {
        console.log(`Current station loaded: ${station.name}`);
        setIsLoading(false);
      },
      onplay: () => {
        setIsPlaying(true);
        setIsLoading(false);
        toast.success(`Now playing: ${station.name}`);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        console.error(`Error loading station ${station.name}:`, error);
        setIsLoading(false);
        setStreamError(`Failed to load ${station.name}`);
        
        // Try fallback URL if available
        if (station.fallbackUrl) {
          toast.info(`Trying alternative stream for ${station.name}...`);
          currentSound.current = new Howl({
            src: [station.fallbackUrl],
            html5: true,
            autoplay: false,
            volume: volume / 100,
            format: ['mp3'],
            onload: () => {
              setIsLoading(false);
              setStreamError(null);
            },
            onloaderror: () => {
              setIsLoading(false);
              setStreamError(`All streams failed for ${station.name}`);
              toast.error(`Unable to play ${station.name}`);
            }
          });
        }
      },
      onplayerror: (id, error) => {
        console.error(`Error playing station ${station.name}:`, error);
        setStreamError(`Failed to play ${station.name}`);
        setIsPlaying(false);
      }
    });
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    setIsLoading(false);
    setStreamError("Failed to initialize audio player");
  }
}

// Preload next and previous stations for faster switching
export function preloadAdjacentStations(
  stations: RadioStation[],
  currentStationIndex: number,
  nextSound: MutableRefObject<Howl | null>,
  previousSound: MutableRefObject<Howl | null>
) {
  const nextIndex = (currentStationIndex + 1) % stations.length;
  const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
  
  // Preload next station
  if (nextSound.current) {
    nextSound.current.unload();
  }
  
  nextSound.current = new Howl({
    src: [stations[nextIndex].url],
    html5: true,
    autoplay: false,
    preload: true,
    volume: 0, // Start with zero volume
    format: ['mp3']
  });
  
  // Preload previous station
  if (previousSound.current) {
    previousSound.current.unload();
  }
  
  previousSound.current = new Howl({
    src: [stations[prevIndex].url],
    html5: true,
    autoplay: false,
    preload: true,
    volume: 0, // Start with zero volume
    format: ['mp3']
  });
}
