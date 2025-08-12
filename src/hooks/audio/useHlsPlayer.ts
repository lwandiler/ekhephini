
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

      const functionsBase = 'https://innpnyojhyedfrtnaxsi.functions.supabase.co';

      // Custom loader to proxy ALL HLS requests (manifest + segments) via edge function
      const ProxyLoader = class extends (Hls as any).DefaultConfig.loader {
        constructor(config: any) {
          super(config);
        }
        load(context: any, config: any, callbacks: any) {
          try {
            const originalUrl: string = context.url;
            const absoluteUrl = context.baseURL ? new URL(originalUrl, context.baseURL).toString() : originalUrl;
            context.url = `${functionsBase}/stream-proxy?url=${encodeURIComponent(absoluteUrl)}`;
          } catch (e) {
            console.warn('ProxyLoader URL rewrite failed, using original URL', e);
          }
          return super.load(context, config, callbacks);
        }
      };

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        loader: ProxyLoader as any,
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

              // If manifest failed, try station fallbackUrl (mp3) if provided
              if (
                (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) &&
                station.fallbackUrl
              ) {
                try {
                  console.warn('HLS: Switching to fallback URL:', station.fallbackUrl);
                  hls.destroy();
                  hlsRef.current = null;
                  audio.src = station.fallbackUrl;
                  audio.load();
                  audio.play().then(() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                    setStreamError(null);
                    toast.success(`Now playing backup: ${station.name}`);
                  }).catch((e) => {
                    console.error('Fallback play failed:', e);
                    setStreamError('Backup stream failed to play');
                    toast.error('Backup stream failed to play');
                  });
                  return;
                } catch (e) {
                  console.error('Fallback switch failed:', e);
                }
              }

              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('HLS: Fatal media error, trying to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('HLS: Fatal error, destroying HLS instance');

              // Try fallback URL if available
              if (station.fallbackUrl) {
                try {
                  console.warn('HLS: Fatal error, switching to fallback URL:', station.fallbackUrl);
                  hls.destroy();
                  hlsRef.current = null;
                  audio.src = station.fallbackUrl;
                  audio.load();
                  audio.play().then(() => {
                    setIsPlaying(true);
                    setIsLoading(false);
                    setStreamError(null);
                    toast.success(`Now playing backup: ${station.name}`);
                  }).catch((e) => {
                    console.error('Fallback play failed:', e);
                    setIsLoading(false);
                    setStreamError('Backup stream failed to play');
                    toast.error('Backup stream failed to play');
                  });
                  return;
                } catch (e) {
                  console.error('Fallback switch failed:', e);
                }
              }

              hls.destroy();
              hlsRef.current = null;
              setIsLoading(false);
              setStreamError(`HLS playback failed for ${station.name}`);
              toast.error(`Unable to play ${station.name}`);
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
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    try {
      // If no media is attached yet for an HLS stream, initialize first
      const isHls = (station.streamUrl || station.url || '').includes('.m3u8');
      if (isHls && !hlsRef.current) {
        initializeHlsPlayer();
      }

      // If the element isn't ready, wait until it can play, then try
      if (audio.readyState < 2) {
        await new Promise<void>((resolve) => {
          const onCanPlay = () => {
            audio.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          audio.addEventListener('canplay', onCanPlay, { once: true } as any);
          // As a nudge for some browsers
          audio.load();
        });
      }

      await audio.play();
    } catch (error) {
      console.error('Play error:', error);
      setStreamError('Playback failed. Please try again.');
    }
  }, [initializeHlsPlayer, setStreamError, station.streamUrl, station.url]);

  const playExternalUrl = useCallback(async (name: string, url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    // Tear down any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setStreamError(null);

    // Helper: try a candidate URL
    const tryPlay = async (candidate: string) => {
      audio.src = candidate;
      audio.volume = volume / 100;
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      (audio as any).mozAudioChannelType = 'content';
      audio.setAttribute('playsinline', '');
      audio.setAttribute('webkit-playsinline', '');
      audio.load();
      await audio.play();
    };

    // If it's an HLS URL, use Hls.js/native path
    if (url.includes('.m3u8')) {
      try {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
          hlsRef.current = hls;
          hls.attachMedia(audio);
          hls.loadSource(url);
          // small delay to allow manifest
          await new Promise((res) => setTimeout(res, 200));
          await audio.play();
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
          await tryPlay(url);
        } else {
          throw new Error('HLS not supported by this browser');
        }
        setIsPlaying(true);
        setIsLoading(false);
        toast.success(`Now playing: ${name}`);
        return;
      } catch (err) {
        console.error('Play external HLS error:', err);
        setIsLoading(false);
        setStreamError('Unable to play this HLS source in your browser');
        toast.error('Unable to play this HLS source');
        return;
      }
    }

    // Non-HLS: attempt HTTPS upgrade or proxy if needed (avoid mixed content/CORS)
    const functionsBase = 'https://innpnyojhyedfrtnaxsi.functions.supabase.co';
    const isHttp = url.startsWith('http://');
    const httpsUrl = isHttp ? url.replace(/^http:\/\//, 'https://') : url;
    const proxiedUrl = `${functionsBase}/stream-proxy?url=${encodeURIComponent(url)}`;

    // Prefer proxy when original is http (mixed content) otherwise try direct first
    const candidates: string[] = isHttp ? [proxiedUrl, httpsUrl] : [httpsUrl, proxiedUrl];

    for (let i = 0; i < candidates.length; i++) {
      try {
        await tryPlay(candidates[i]);
        setIsPlaying(true);
        setIsLoading(false);
        toast.success(`Now playing: ${name}`);
        return;
      } catch (err) {
        console.error(`Play external URL error (attempt ${i + 1}):`, err);
        // continue to next candidate
      }
    }

    // If all attempts failed, show helpful message
    setIsLoading(false);
    const msg = isHttp
      ? 'This audio link is http and blocked on https. Proxy and https attempts failed. Please provide an https-capable link.'
      : 'Unable to play this audio (direct and proxy attempts failed).';
    setStreamError(msg);
    toast.error(msg);
  }, [setIsLoading, setStreamError, setIsPlaying, volume]);

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
    playExternalUrl,
    pause,
    setVolumeLevel,
    audioElement: audioRef.current
  };
}
