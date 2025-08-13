
import { useState, useEffect, useRef, useContext } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { useStreamUrlExtractor } from '@/hooks/useStreamUrlExtractor';
import { defaultStationSettings } from '@/utils/stationSettingsManager';
import { StationContext } from '@/contexts/StationContext';

export function useAudioState() {
  const { settings } = useContext(StationContext);
  console.log("DEBUG: Full settings object:", settings);
  const [stations, setStations] = useState<RadioStation[]>([{
    id: 'live',
    name: defaultStationSettings.stationName,
    url: defaultStationSettings.streamUrl,
    streamUrl: defaultStationSettings.streamUrl,
    description: defaultStationSettings.stationDescription,
    genre: 'Radio',
    location: 'Online'
  }]);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentPodcast, setCurrentPodcast] = useState<{ name: string; thumbnailUrl?: string | null } | null>(null);

  // Audio references
  const currentSound = useRef<Howl | null>(null);
  const nextSound = useRef<Howl | null>(null);
  const previousSound = useRef<Howl | null>(null);

  // Extract stream URL from MCRS website - disabled to use database URL
  // const { extractedUrl, isExtracting, extractionError } = useStreamUrlExtractor();
  const extractedUrl = null;
  const isExtracting = false;
  const extractionError = null;

  // Note: Do not clear localStorage or broadcast settings updates here.
  // StationContext manages settings loading and caching; clearing here caused defaults to override saved settings.

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
      
      const newStation: RadioStation = {
        id: 'live',
        name: settings?.stationName || defaultStationSettings.stationName,
        url: streamUrl,
        streamUrl: streamUrl,
        description: settings?.stationDescription || defaultStationSettings.stationDescription,
        genre: 'Radio',
        location: 'Online',
        fallbackUrl: settings?.recordingStreamUrl || undefined
      };

      console.log("Rebuilt live station from DB settings:", newStation);
      setStations([newStation]);
      setCurrentStationIndex(0);
      
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
    currentPodcast,
    setCurrentPodcast,
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
