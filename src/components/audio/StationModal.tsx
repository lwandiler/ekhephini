
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, ExternalLink, Radio } from 'lucide-react';
import { RadioStation } from '@/hooks/audio/types';
import { SongMetadata } from '@/hooks/audio/types';
import { ShowWithFormattedTime } from '@/services/api/showsService';
import PlaybackControls from './PlaybackControls';
import SongMetadataComponent from './SongMetadata';
import FallbackModeToggle from './modal/FallbackModeToggle';
import TroubleshootingTips from './modal/TroubleshootingTips';
import StreamUrlDisplay from './modal/StreamUrlDisplay';

interface StationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (value: number[]) => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onForceTryPlay: () => void;
  fallbackMode: boolean;
  setFallbackMode: (mode: boolean) => void;
  songMetadata?: SongMetadata;
  currentShow?: ShowWithFormattedTime | null;
}

const StationModal: React.FC<StationModalProps> = ({
  isOpen,
  onOpenChange,
  station,
  isPlaying,
  isLoading,
  volume,
  onTogglePlay,
  onVolumeChange,
  onChangeStation,
  onForceTryPlay,
  fallbackMode,
  setFallbackMode,
  songMetadata,
  currentShow
}) => {
  const handleOpenInNewTab = () => {
    const streamUrl = station.streamUrl || station.url;
    window.open(streamUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-radio-blue text-white border-radio-light-blue">
        <div className="flex justify-between items-start mb-4">
          <DialogTitle className="text-xl font-bold text-white">
            {station.name}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Current Show Info */}
        {currentShow && (
          <div className="mb-6 p-4 bg-radio-light-blue/20 rounded-lg border border-radio-light-blue/30">
            <div className="flex items-center gap-2 mb-2">
              <Radio size={16} className="text-red-400" />
              <span className="text-sm font-medium text-red-400">NOW PLAYING</span>
            </div>
            <h3 className="font-bold text-white mb-1">{currentShow.title}</h3>
            <p className="text-sm text-gray-200">with {currentShow.host}</p>
            <p className="text-xs text-gray-300 mt-1">{currentShow.time}</p>
            {currentShow.description && (
              <p className="text-xs text-gray-300 mt-2">{currentShow.description}</p>
            )}
          </div>
        )}

        {/* Song Metadata */}
        <div className="mb-6">
          <SongMetadataComponent
            artist={songMetadata?.artist}
            title={songMetadata?.title}
            albumCover={songMetadata?.albumCover}
            isLoading={isLoading}
            isPlaying={isPlaying}
          />
        </div>

        {/* Playback Controls */}
        <div className="mb-6">
          <PlaybackControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onTogglePlay={onTogglePlay}
            onChangeStation={onChangeStation}
            onForceTryPlay={onForceTryPlay}
          />
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-300 w-16">Volume</span>
            <Slider
              value={[volume]}
              onValueChange={onVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-300 w-8">{volume}%</span>
          </div>
        </div>

        {/* Fallback Mode Toggle */}
        <FallbackModeToggle
          fallbackMode={fallbackMode}
          setFallbackMode={setFallbackMode}
        />

        {/* Stream URL Display */}
        <StreamUrlDisplay station={station} />

        {/* Open in New Tab Button */}
        <Button
          onClick={handleOpenInNewTab}
          variant="outline"
          className="w-full mb-4 border-white/20 text-white hover:bg-white/10"
        >
          <ExternalLink size={16} className="mr-2" />
          Open Stream in New Tab
        </Button>

        {/* Troubleshooting Tips */}
        <TroubleshootingTips />
      </DialogContent>
    </Dialog>
  );
};

export default StationModal;
