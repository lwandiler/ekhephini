
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import StationInfo from '@/components/audio/StationInfo';
import StationDisplay from '@/components/audio/StationDisplay';
import StationModal from '@/components/audio/StationModal';
import { useRadioModal } from '@/hooks/useRadioModal';
import { useRadioKeyboardControls } from '@/hooks/useRadioKeyboardControls';
import { openStreamInNewTab } from '@/utils/streamUtils';
import { useSongMetadata } from '@/hooks/audio/useSongMetadata';
import { useCurrentShow } from '@/hooks/useCurrentShow';
import { TooltipProvider } from '@/components/ui/tooltip';
import PlayerControlsWrapper from '@/components/audio/PlayerControlsWrapper';
import { toast } from 'sonner';
import { StationContext } from '@/contexts/StationContext';

interface RadioPlayerProps {
  showName?: string;
  hostName?: string;
}

const RadioPlayer = ({
  showName = "Morning Vibes",
  hostName = "DJ Alex"
}: RadioPlayerProps) => {
  const { modalOpen, setModalOpen } = useRadioModal();
  const [fallbackMode, setFallbackMode] = useState(false);
  const { settings } = useContext(StationContext);
  const radioPlayerRef = useRef<HTMLDivElement>(null);
  const { currentShow, loading: showLoading } = useCurrentShow();
  
  const {
    stations,
    currentStationIndex,
    isPlaying,
    isLoading,
    volume,
    streamError,
    togglePlayPause,
    playNextStation,
    playPreviousStation,
    setVolume,
    forceTryPlay,
    getCurrentStationName
  } = useAudioPlayer();

  // Add song metadata hook with console logging
  const songMetadata = useSongMetadata(isPlaying, currentStationIndex, stations);
  console.log('RadioPlayer: Song metadata received', songMetadata);
  console.log('RadioPlayer: isPlaying', isPlaying, 'currentStationIndex', currentStationIndex);
  
  // Set up keyboard controls for volume and playback
  useRadioKeyboardControls(volume, togglePlayPause, (newVolume) => setVolume(newVolume[0]));

  // Listen for trigger play events from listen live button
  useEffect(() => {
    const handleTriggerPlay = () => {
      if (!isPlaying) {
        togglePlayPause();
      }
    };

    const radioPlayerElement = radioPlayerRef.current;
    if (radioPlayerElement) {
      radioPlayerElement.addEventListener('triggerPlay', handleTriggerPlay);
      return () => {
        radioPlayerElement.removeEventListener('triggerPlay', handleTriggerPlay);
      };
    }
  }, [isPlaying, togglePlayPause]);

  // Function to handle changing stations in either direction
  const handleChangeStation = (direction: 'next' | 'prev') => {
    console.log(`Changing station: ${direction}`);
    if (direction === 'next') {
      playNextStation();
    } else {
      playPreviousStation();
    }
  };

  // Function to open current station in a new tab as fallback
  const handleOpenStreamInTab = () => {
    // Pass the settings streamUrl to the current station object
    const currentStation = {
      ...stations[currentStationIndex],
      streamUrl: settings.streamUrl // Add settings stream URL
    };
    openStreamInNewTab(currentStation);
  };
  
  // Function to handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  // Use current show info if available, otherwise fall back to props
  const displayShowName = currentShow?.title || showName;
  const displayHostName = currentShow?.host || hostName;

  // Debug for toggling play
  console.log("RadioPlayer: togglePlayPause is", typeof togglePlayPause === 'function' ? 'a function' : 'not a function');

  return (
    <TooltipProvider>
      <div 
        ref={radioPlayerRef}
        data-radio-player
        className="fixed bottom-0 left-0 right-0 bg-radio-blue text-white py-3 px-4 z-50 shadow-lg dark:bg-gray-900"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <StationInfo 
              showName={displayShowName} 
              hostName={displayHostName}
              streamError={streamError}
              songMetadata={songMetadata}
              isLive={!!currentShow}
              streamUrl={settings.streamUrl}
            />
            
            <PlayerControlsWrapper
              isPlaying={isPlaying}
              isLoading={isLoading}
              volume={volume}
              streamError={streamError}
              togglePlayPause={togglePlayPause}
              handleVolumeChange={handleVolumeChange}
              changeStation={handleChangeStation}
              forceTryPlay={forceTryPlay}
              switchToFallbackMode={() => setFallbackMode(true)}
              openStreamInNewTab={handleOpenStreamInTab}
              onOpenModal={() => setModalOpen(true)}
            />
            
            <StationDisplay stationName={getCurrentStationName()} />
          </div>
        </div>
      </div>

      <StationModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        station={{
          ...stations[currentStationIndex],
          streamUrl: settings.streamUrl // Add settings stream URL
        }}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        onTogglePlay={togglePlayPause}
        onVolumeChange={handleVolumeChange}
        onChangeStation={handleChangeStation}
        onForceTryPlay={forceTryPlay}
        fallbackMode={fallbackMode}
        setFallbackMode={setFallbackMode}
        songMetadata={songMetadata}
        currentShow={currentShow}
      />
    </TooltipProvider>
  );
};

export default RadioPlayer;
