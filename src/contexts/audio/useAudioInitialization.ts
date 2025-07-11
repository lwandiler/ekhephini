
import { useEffect } from 'react';
import { tryUnlockAllAudioContexts } from '@/hooks/audio/utils/audioContextUnlockUtils';
import { loadCurrentStation, preloadAdjacentStations } from './audioLoaders';
import { MutableRefObject } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';

export function useAudioInitialization(
  stations: RadioStation[],
  currentStationIndex: number,
  volume: number,
  currentSound: MutableRefObject<Howl | null>,
  nextSound: MutableRefObject<Howl | null>,
  previousSound: MutableRefObject<Howl | null>,
  setIsLoading: (loading: boolean) => void,
  setStreamError: (error: string | null) => void,
  setIsPlaying: (playing: boolean) => void
) {
  useEffect(() => {
    const initializeAudio = async () => {
      await tryUnlockAllAudioContexts();
      loadCurrentStation(
        stations[currentStationIndex], 
        volume, 
        currentSound, 
        setIsLoading, 
        setStreamError, 
        setIsPlaying
      );
      preloadAdjacentStations(stations, currentStationIndex, nextSound, previousSound);
    };

    initializeAudio();
  }, []);
}
