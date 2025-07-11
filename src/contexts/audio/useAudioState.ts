
import { useState, useEffect, useRef, useContext } from 'react';
import { Howl } from 'howler';
import { defaultStations } from './defaultStations';
import { StationContext } from '@/contexts/StationContext';
import { RadioStation } from '@/hooks/audio/types';

export function useAudioState() {
  const { settings } = useContext(StationContext);
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

  // Update the first station with the stream URL from settings when available
  useEffect(() => {
    if (settings?.streamUrl && stations.length > 0) {
      console.log("Setting stream URL from settings:", settings.streamUrl);
      
      const updatedStations = [...stations];
      updatedStations[0] = {
        ...updatedStations[0],
        url: settings.streamUrl,
        name: settings.stationName || updatedStations[0].name,
        description: settings.stationDescription || updatedStations[0].description
      };
      
      setStations(updatedStations);
    }
  }, [settings?.streamUrl, settings?.stationName, settings?.stationDescription]);

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
    playPreviousStation
  };
}
