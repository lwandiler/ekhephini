
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

  // Force clear localStorage cache and refresh settings on mount
  useEffect(() => {
    // Clear cached settings to force fresh load from database
    localStorage.removeItem('stationSettings');
    // Trigger settings refresh
    document.dispatchEvent(new CustomEvent('settingsUpdated'));
  }, []);

  // Update the first station with the stream URL from settings or extracted URL
  useEffect(() => {
    // Only use database settings, ignore extracted URL
    console.log("DEBUG: settings?.streamUrl =", settings?.streamUrl);
    console.log("DEBUG: extractedUrl =", extractedUrl);
    const streamUrl = settings?.streamUrl;
    
    if (streamUrl && stations.length > 0) {
      console.log("Setting stream URL:", streamUrl);
      
      // Force refresh settings when they change to ensure we get latest from DB
      if (settings?.streamUrl && settings.streamUrl !== streamUrl) {
        // Trigger a settings refresh
        document.dispatchEvent(new CustomEvent('settingsUpdated'));
      }
      
      const updatedStations = [...stations];
      updatedStations[0] = {
        ...updatedStations[0],
        url: streamUrl,
        streamUrl: streamUrl,
        name: settings?.stationName || updatedStations[0].name,
        description: settings?.stationDescription || updatedStations[0].description
      };
      
      setStations(updatedStations);
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
