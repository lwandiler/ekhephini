
import { useEffect } from 'react';
import { tryUnlockAllAudioContexts } from '@/hooks/audio/utils/audioContextUnlockUtils';
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
      try {
        await tryUnlockAllAudioContexts();
        console.log('Audio context unlocked successfully');
        
        // Clear any existing errors
        setStreamError(null);
        
        // The HLS player will be initialized automatically when needed
        console.log('Audio initialization complete - HLS player ready');
      } catch (error) {
        console.error('Audio initialization failed:', error);
        setStreamError('Audio initialization failed');
      }
    };

    initializeAudio();
  }, [setStreamError]);
}
