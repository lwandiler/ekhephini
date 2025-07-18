
import React, { createContext, useContext } from 'react';
import { AudioPlayerContextProps } from './audio/types';
import { useAudioState } from './audio/useAudioState';
import { createAudioControls } from './audio/audioControls';
import { useAudioInitialization } from './audio/useAudioInitialization';

export const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize audio state
  const audioState = useAudioState();
  
  // Initialize audio on component mount
  useAudioInitialization(
    audioState.stations,
    audioState.currentStationIndex,
    audioState.volume,
    audioState.currentSound,
    audioState.nextSound,
    audioState.previousSound,
    audioState.setIsLoading,
    audioState.setStreamError,
    audioState.setIsPlaying
  );
  
  // Create audio control functions
  const controls = createAudioControls(audioState);
  
  // Combine state and controls for the context value
  const value = {
    stations: audioState.stations,
    currentStationIndex: audioState.currentStationIndex,
    isPlaying: audioState.isPlaying,
    isLoading: audioState.isLoading,
    volume: audioState.volume,
    streamError: audioState.streamError,
    ...controls
  };
  
  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextProps => {
  const context = useContext(AudioPlayerContext);
  
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  
  return context;
};
