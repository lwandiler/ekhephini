
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RadioStation } from '@/hooks/audio/types';
import ModalHeader from './modal/ModalHeader';
import ModalContent from './modal/ModalContent';
import ModalFooter from './modal/ModalFooter';

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
  onForceTryPlay?: () => void;
  fallbackMode?: boolean;
  setFallbackMode?: (mode: boolean) => void;
  songMetadata?: { artist: string; title: string };
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
  fallbackMode = false,
  setFallbackMode,
  songMetadata
}) => {
  // Track last interaction time to prevent multiple rapid clicks
  const lastInteractionTime = useRef<number>(0);
  const interactionCooldown = 1000; // 1 second cooldown
  
  // Attempt to unlock audio context when modal opens
  useEffect(() => {
    if (isOpen) {
      // When the modal opens, try to interact with the audio context
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log('AudioContext resumed by modal interaction');
          });
        }
      } catch (e) {
        console.error('Error accessing AudioContext:', e);
      }
    }
  }, [isOpen]);

  // Add a click handler to the modal to try to unlock the audio context
  const handleModalClick = () => {
    const now = Date.now();
    // Check if enough time has passed since last interaction
    if (now - lastInteractionTime.current < interactionCooldown) {
      console.log("Ignoring rapid click, cooldown active");
      return;
    }
    
    // Update last interaction time
    lastInteractionTime.current = now;
    
    if (!isPlaying && onForceTryPlay) {
      onForceTryPlay();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md overflow-hidden backdrop-blur-md bg-gradient-to-br from-blue-900/80 to-purple-900/80 border border-white/20 shadow-xl dark:from-gray-900/90 dark:to-blue-900/80 text-white" 
        onClick={handleModalClick}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0zMCA1Ljc3MkwzNC44MyAxN2g2LjkxMWwtNS41OTUgMy45NyAyLjEzNyA2LjQwMkwzMCAyMy4zNzlsLTguMjgzIDYuMDljMi4xMzctNi40MDIgMi4xMzctNi40MDIgMi4xMzctNi40MDJMMTguMjYgMTdoNi45MTFMMzAgNS43NzJ6IiBmaWxsPSIjNTI1MkZGMjAiIGZpbGwtb3BhY2l0eT0iLjIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10 text-white">
          <ModalHeader stationName={station.name} />
          
          <ModalContent 
            station={station}
            isPlaying={isPlaying}
            isLoading={isLoading}
            volume={volume}
            onTogglePlay={onTogglePlay}
            onVolumeChange={onVolumeChange}
            onChangeStation={onChangeStation}
            onForceTryPlay={onForceTryPlay}
            fallbackMode={fallbackMode}
            setFallbackMode={setFallbackMode}
            songMetadata={songMetadata}
          />
          
          <ModalFooter 
            station={station} 
            onClose={() => onOpenChange(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StationModal;
