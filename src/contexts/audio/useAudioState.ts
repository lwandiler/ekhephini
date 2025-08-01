
import { useState, useEffect, useRef, useContext } from 'react';
import { Howl } from 'howler';
import { defaultStations } from './defaultStations';
import { StationContext } from '@/contexts/StationContext';
import { RadioStation } from '@/hooks/audio/types';
import { useStreamUrlExtractor } from '@/hooks/useStreamUrlExtractor';

export function useAudioState() {
  const { settings } = useContext(StationContext);
  console.log("DEBUG: Full settings object:", settings);
  const [stations, setStations] = useState<RadioStation[]>(defaultStations);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Audio references
  const currentSound = useRef<Howl | null>(null);
  const nextSound = useRef<Howl | null>(null);
  const previousSound = useRef<Howl | null>(null);

  // Extract stream URL from MCRS website - disabled to use database URL
  // const { extractedUrl, isExtracting, extractionError } = useStreamUrlExtractor();
  const extractedUrl = null;
  const isExtracting = false;
  const extractionError = null;

  // Force clear all caches on mount
  useEffect(() => {
    // Clear all possible cached settings
    localStorage.removeItem('stationSettings');
    localStorage.removeItem('radioSettings');
    localStorage.removeItem('audioPlayerState');
    
    // Clear any Howler cache
    if (currentSound.current) {
      currentSound.current.unload();
      currentSound.current = null;
    }
    if (nextSound.current) {
      nextSound.current.unload();
      nextSound.current = null;
    }
    if (previousSound.current) {
      previousSound.current.unload();
      previousSound.current = null;
    }
    
    // Force stop any playing audio
    setIsPlaying(false);
    setIsLoading(false);
    setStreamError(null);
    
    // Trigger settings refresh
    document.dispatchEvent(new CustomEvent('settingsUpdated'));
  }, []);

  // Update the first station with the stream URL from settings and force audio reload
  useEffect(() => {
    // Only use database settings, ignore extracted URL
    console.log("DEBUG: settings?.streamUrl =", settings?.streamUrl);
    console.log("DEBUG: extractedUrl =", extractedUrl);
    const streamUrl = settings?.streamUrl;
    
    if (streamUrl && stations.length > 0) {
      console.log("Setting stream URL:", streamUrl);
      
      // Force cleanup of existing audio before updating
      if (currentSound.current) {
        console.log("Cleaning up existing audio instance");
        currentSound.current.stop();
        currentSound.current.unload();
        currentSound.current = null;
        setIsPlaying(false);
      }
      
      // Update stations with new URL
      const updatedStations = [...stations];
      updatedStations[0] = {
        ...updatedStations[0],
        url: streamUrl,
        streamUrl: streamUrl,
        name: settings?.stationName || updatedStations[0].name,
        description: settings?.stationDescription || updatedStations[0].description
      };
      
      console.log("Updated first station:", updatedStations[0]);
      setStations(updatedStations);
      
      // Reset player state
      setStreamError(null);
      setIsLoading(false);
    }
  }, [settings?.streamUrl, settings?.stationName, settings?.stationDescription, extractedUrl]);

  // Show extraction status
  useEffect(() => {
    if (isExtracting) {
      console.log("Extracting stream URL from MCRS website...");
    }
    if (extractionError) {
      console.warn("Stream URL extraction failed:", extractionError);
    }
    if (extractedUrl) {
      console.log("Successfully extracted stream URL:", extractedUrl);
    }
  }, [isExtracting, extractionError, extractedUrl]);

  // Function to get current station name
  const getCurrentStationName = () => {
    return stations[currentStationIndex]?.name || "Loading...";
  };

  // Play next station
  const playNextStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex + 1) % stations.length);
  };

  // Play previous station
  const playPreviousStation = () => {
    setCurrentStationIndex((prevIndex) => (prevIndex - 1 + stations.length) % stations.length);
  };

  return {
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
    getCurrentStationName,
    playNextStation,
    playPreviousStation,
    extractedUrl,
    isExtracting,
    extractionError
  };
}
