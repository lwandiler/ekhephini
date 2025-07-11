
import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Radio } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onForceTryPlay?: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  isLoading,
  onTogglePlay,
  onChangeStation,
  onForceTryPlay
}) => {
  // Add a ref for tracking the last force play click time
  const lastForcePlayTime = useRef<number>(0);
  const lastToggleTime = useRef<number>(0);
  const forcePlayCooldown = 2000; // 2 second cooldown between force play attempts
  const toggleCooldown = 500; // 500ms cooldown between toggle attempts
  
  // Handle force play with debounce
  const handleForceTryPlay = useCallback(() => {
    if (!onForceTryPlay) return;
    
    const now = Date.now();
    if (now - lastForcePlayTime.current < forcePlayCooldown) {
      console.log("Force play cooldown active, ignoring click");
      return;
    }
    
    // Update the last click time and call the handler
    lastForcePlayTime.current = now;
    onForceTryPlay();
  }, [onForceTryPlay, forcePlayCooldown]);
  
  // Handle toggle play with debounce
  const handleTogglePlay = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTime.current < toggleCooldown) {
      console.log("Toggle cooldown active, ignoring rapid click");
      return;
    }
    
    // Update the last toggle time and call the handler
    lastToggleTime.current = now;
    console.log("PlaybackControls: Calling onTogglePlay");
    
    if (typeof onTogglePlay === 'function') {
      onTogglePlay();
    } else {
      console.error("onTogglePlay is not a function:", onTogglePlay);
    }
  }, [onTogglePlay, toggleCooldown]);

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-transparent border-white/20 hover:bg-white/10 dark:border-gray-700 dark:hover:bg-gray-800"
        onClick={() => onChangeStation('prev')}
        title="Previous station"
      >
        <SkipBack size={18} />
      </Button>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-radio-accent border-none hover:bg-radio-accent/80 w-12 h-12 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={handleTogglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isPlaying ? 'Pause' : 'Play'}
        </TooltipContent>
      </Tooltip>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-transparent border-white/20 hover:bg-white/10 dark:border-gray-700 dark:hover:bg-gray-800"
        onClick={() => onChangeStation('next')}
        title="Next station"
      >
        <SkipForward size={18} />
      </Button>

      {onForceTryPlay && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent border-white/20 hover:bg-white/10 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={handleForceTryPlay}
              title="Force play (if stuck)"
            >
              <Radio size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Force play (if stuck)
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default PlaybackControls;
