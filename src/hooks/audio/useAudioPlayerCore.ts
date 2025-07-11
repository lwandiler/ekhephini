
import { useAudioPlayerState } from './core/useAudioPlayerState';
import { useAudioEffects } from './core/useAudioEffects';
import { useAudioControlHandlers } from './core/useAudioControls';
import { AudioPlayerProps, AudioPlayerReturn } from './types';

export function useAudioPlayerCore({ 
  stations, 
  initialVolume = 80, 
  fallbackMode = false,
  autoInitialize = true 
}: AudioPlayerProps): AudioPlayerReturn {
  // Initialize state
  const state = useAudioPlayerState({ initialVolume, fallbackMode, autoInitialize });
  
  // Setup audio effects - fixed the ordering issue
  const { resetRetryCount } = useAudioEffects(state, stations);
  
  // Setup control handlers
  const {
    togglePlayPause,
    forceTryPlay,
    handleVolumeChange,
    changeStation
  } = useAudioControlHandlers(state, stations);

  return {
    isPlaying: state.isPlaying,
    volume: state.volume,
    isLoading: state.isLoading,
    currentStation: state.currentStation,
    streamError: state.streamError,
    togglePlayPause,
    handleVolumeChange,
    changeStation,
    forceTryPlay
  };
}
