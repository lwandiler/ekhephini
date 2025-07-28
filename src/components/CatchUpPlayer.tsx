import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Volume2,
  VolumeX,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import Hls from 'hls.js';

interface CatchUpPlayerProps {
  audioUrl: string;
  title: string;
  showTitle: string;
  onClose: () => void;
}

export const CatchUpPlayer: React.FC<CatchUpPlayerProps> = ({
  audioUrl,
  title,
  showTitle,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<any>(null);
  const progressUpdateRef = useRef<number | null>(null);

  // Initialize audio player
  useEffect(() => {
    const initializePlayer = () => {
      setIsLoading(true);
      
      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set volume
      audio.volume = volume / 100;
      
      // Check if HLS.js is supported
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: false,
        });
        
        hlsRef.current = hls;
        hls.loadSource(audioUrl);
        hls.attachMedia(audio);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setDuration(audio.duration || 0);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            toast.error('Error loading recording');
            onClose();
          }
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support
        audio.src = audioUrl;
        audio.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          setDuration(audio.duration || 0);
        });
      } else {
        toast.error('HLS playback not supported');
        onClose();
        return;
      }
      
      // Audio event listeners
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      audio.addEventListener('error', () => {
        toast.error('Error loading recording');
        onClose();
      });
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration || 0);
      });
    };

    initializePlayer();

    // Cleanup function
    return () => {
      if (progressUpdateRef.current) {
        cancelAnimationFrame(progressUpdateRef.current);
      }
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioUrl, onClose, volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play recording');
      });
    }
  };

  const stop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-green-900 border-green-700 text-white rounded-none border-t">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-white truncate">{title}</h4>
            <p className="text-xs text-green-300 truncate">{showTitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-white hover:text-green-300"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={seek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={isLoading || duration === 0}
          />
          <div className="flex justify-between text-xs text-green-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Skip Back */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(-15)}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-white hover:text-green-300"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-10 w-10 p-0 text-white hover:text-green-300"
            >
              {isLoading ? (
                <Clock className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Skip Forward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(15)}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-white hover:text-green-300"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Stop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={stop}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-white hover:text-green-300"
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 min-w-0 flex-1 max-w-32 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0 flex-shrink-0 text-white hover:text-green-300"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};