
import { useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { RadioStation } from './types';
import { toast } from 'sonner';

interface UseHlsPlayerProps {
  station: RadioStation;
  volume: number;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setStreamError: (error: string | null) => void;
}

export function useHlsPlayer({
  station,
  volume,
  setIsPlaying,
  setIsLoading,
  setStreamError
}: UseHlsPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const initializeHlsPlayer = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    const streamUrl = station.streamUrl || station.url;
    
    setIsLoading(true);
    setStreamError(null);

    // Clean up existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Set up audio element properties
    audio.volume = volume / 100;
    audio.crossOrigin = 'anonymous';
    
    // Prevent audio from being paused when tab is hidden
    audio.preload = 'auto';
    (audio as any).mozAudioChannelType = 'content';
    
    // Add these attributes to help with background playback
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');

    // Set up event listeners
    audio.addEventListener('loadstart', () => {
      console.log('HLS Audio: Load started');
    });

    audio.addEventListener('canplay', () => {
      console.log('HLS Audio: Can play');
      setIsLoading(false);
      setStreamError(null);
      toast.success(`${station.name} ready`);
    });

    audio.addEventListener('play', () => {
      setIsPlaying(true);
      toast.success(`Now playing: ${station.name}`);
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
    });

    audio.addEventListener('error', (e) => {
      console.error('HLS Audio error:', e);
      setIsLoading(false);
      setStreamError(`${station.name} stream unavailable`);
      toast.error(`Unable to play ${station.name}`);
    });

    // Check if HLS is supported and stream is M3U8
    if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
      console.log('Using HLS.js for M3U8 stream:', streamUrl);
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('HLS: Media attached');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS: Manifest parsed successfully');
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('HLS: Fatal network error, trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('HLS: Fatal media error, trying to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('HLS: Fatal error, destroying HLS instance');
              hls.destroy();
              setStreamError(`HLS playback failed for ${station.name}`);
              break;
          }
        }
      });

      // Attach media and load source
      hls.attachMedia(audio);
      hls.loadSource(streamUrl);
      
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      console.log('Using native HLS support for Safari:', streamUrl);
      audio.src = streamUrl;
      audio.load();
    } else {
      // Fallback to regular audio for non-M3U8 streams
      console.log('Using regular audio for non-M3U8 stream:', streamUrl);
      audio.src = streamUrl;
      audio.load();
    }

  }, [station, volume, setIsPlaying, setIsLoading, setStreamError]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Play error:', error);
      setStreamError('Playback blocked - please interact with the page first');
    }
  }, [setStreamError]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const setVolumeLevel = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Handle tab visibility changes to keep audio playing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (audioRef.current && !audioRef.current.paused) {
        // Keep the audio playing even when tab is hidden
        console.log('Tab visibility changed, ensuring audio continues playing');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, []);

  return {
    initializeHlsPlayer,
    play,
    pause,
    setVolumeLevel,
    audioElement: audioRef.current
  };
}
