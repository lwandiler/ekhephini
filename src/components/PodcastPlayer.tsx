
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Download, SkipBack, SkipForward } from 'lucide-react';
import { Podcast } from '@/components/PodcastCard';

interface PodcastPlayerProps {
  currentPodcast: Podcast | null;
  onClose: () => void;
}

const PodcastPlayer = ({ currentPodcast, onClose }: PodcastPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentPodcast]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleDownload = () => {
    if (currentPodcast?.listenUrl) {
      const link = document.createElement('a');
      link.href = currentPodcast.listenUrl;
      link.download = `${currentPodcast.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.currentTime + 15, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentPodcast) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-green-900 border-green-700 text-white rounded-none border-t">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={currentPodcast.listenUrl}
          preload="metadata"
        />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={currentPodcast.image}
              alt={currentPodcast.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white truncate">{currentPodcast.title}</h4>
              <p className="text-sm text-green-300 truncate">{currentPodcast.host}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="text-white hover:text-green-300"
            >
              <SkipBack size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:text-green-300"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="text-white hover:text-green-300"
            >
              <SkipForward size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:text-green-300"
            >
              <Download size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:text-green-300"
            >
              ×
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-300 w-12">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-green-300 w-12">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center space-x-2 justify-end">
            <Volume2 size={16} className="text-green-300" />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodcastPlayer;
