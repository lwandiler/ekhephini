
import React from 'react';
import { Music } from 'lucide-react';
import PlaybackControls from '../PlaybackControls';
import VolumeControl from '../VolumeControl';
import FallbackModeToggle from './FallbackModeToggle';
import StreamUrlDisplay from './StreamUrlDisplay';
import TroubleshootingTips from './TroubleshootingTips';
import SongMetadata from '../SongMetadata';
import { RadioStation, SongMetadata as SongMetadataType } from '@/hooks/audio/types';

interface ModalContentProps {
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (value: number[]) => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onForceTryPlay?: () => void;
  fallbackMode?: boolean;
  setFallbackMode?: (mode: boolean) => void;
  songMetadata?: SongMetadataType;
}

const ModalContent: React.FC<ModalContentProps> = ({
  station,
  isPlaying,
  isLoading,
  volume,
  onTogglePlay,
  onVolumeChange,
  onChangeStation,
  onForceTryPlay,
  fallbackMode = false,
  setFallbackMode,
  songMetadata
}) => {
  return (
    <div className="py-6 text-white">
      <div className="flex justify-center items-center mb-8">
        <div className="bg-radio-light-blue dark:bg-gray-800 p-8 rounded-full relative overflow-hidden w-32 h-32 flex items-center justify-center">
          {songMetadata?.albumCover ? (
            <>
              <img 
                src={songMetadata.albumCover} 
                alt="Album Cover"
                className="absolute inset-0 w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Music size={48} className={`text-radio-accent dark:text-blue-400 hidden ${isPlaying ? 'animate-pulse' : ''}`} />
            </>
          ) : (
            <Music size={48} className={`text-radio-accent dark:text-blue-400 ${isPlaying ? 'animate-pulse' : ''}`} />
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Display song metadata if available */}
        {songMetadata && (
          <div className="flex justify-center items-center">
            <SongMetadata 
              artist={songMetadata.artist}
              title={songMetadata.title}
              albumCover={songMetadata.albumCover}
              isLoading={isLoading}
              isPlaying={isPlaying}
            />
          </div>
        )}
        
        <div className="flex justify-center">
          <PlaybackControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onTogglePlay={onTogglePlay}
            onChangeStation={onChangeStation}
            onForceTryPlay={onForceTryPlay}
          />
        </div>
        
        <div className="flex items-center justify-center px-4">
          <VolumeControl
            volume={volume}
            onVolumeChange={onVolumeChange}
          />
        </div>
        
        {setFallbackMode && (
          <FallbackModeToggle
            fallbackMode={fallbackMode}
            setFallbackMode={setFallbackMode}
          />
        )}
        
        <div className="text-center text-white">
          <StreamUrlDisplay station={station} />
          
          {!isPlaying && <TroubleshootingTips />}
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
