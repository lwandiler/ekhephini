
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize } from 'lucide-react';
import PlaybackControls from './PlaybackControls';
import VolumeControl from './VolumeControl';
import StatusIndicator from './StatusIndicator';

interface PlayerControlsWrapperProps {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  streamError: string | null;
  togglePlayPause: () => void;
  handleVolumeChange: (value: number[]) => void;
  changeStation: (direction: 'next' | 'prev') => void;
  forceTryPlay: () => void;
  switchToFallbackMode: () => void;
  openStreamInNewTab: () => void;
  onOpenModal: () => void;
}

const PlayerControlsWrapper: React.FC<PlayerControlsWrapperProps> = ({
  isPlaying,
  isLoading,
  volume,
  streamError,
  togglePlayPause,
  handleVolumeChange,
  changeStation,
  forceTryPlay,
  switchToFallbackMode,
  openStreamInNewTab,
  onOpenModal
}) => {
  // Add a log to verify togglePlayPause is a function
  console.log("PlayerControlsWrapper: togglePlayPause is", typeof togglePlayPause === 'function' ? 'a function' : 'not a function');

  const handleTogglePlay = () => {
    console.log("PlayerControlsWrapper: handleTogglePlay called");
    togglePlayPause();
  };

  return (
    <div className="flex items-center space-x-3">
      <PlaybackControls 
        isPlaying={isPlaying}
        isLoading={isLoading}
        onTogglePlay={handleTogglePlay}
        onChangeStation={changeStation}
        onForceTryPlay={forceTryPlay}
      />
      
      <VolumeControl 
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
      
      <StatusIndicator isPlaying={isPlaying} />

      {/* Error actions removed per request */}

      <Button
        variant="ghost"
        size="icon"
        className="ml-2 text-white hover:bg-white/10"
        onClick={onOpenModal}
        title="Expand player"
      >
        <Maximize size={18} />
      </Button>
    </div>
  );
};

export default PlayerControlsWrapper;
