
import { Howl } from 'howler';
import { RadioStation } from '@/hooks/audio/types';
import { toast } from 'sonner';
import { MutableRefObject } from 'react';

// Load and setup the current station audio
export function loadCurrentStation(
  station: RadioStation,
  volume: number,
  currentSound: MutableRefObject<Howl | null>,
  setIsLoading: (loading: boolean) => void,
  setStreamError: (error: string | null) => void,
  setIsPlaying: (playing: boolean) => void
) {
  if (currentSound.current) {
    currentSound.current.unload();
  }
  
  setIsLoading(true);
  setStreamError(null);
  
  // Use the stream URL from station settings if available, otherwise use station URL
  const streamUrl = station.streamUrl || station.url;
  console.log(`Loading station: ${station.name} with URL: ${streamUrl}`);
  
  try {
    // Determine format based on URL - for M3U8, try both formats
    const isM3U8 = streamUrl.includes('.m3u8');
    const formats = isM3U8 ? ['m3u8', 'mp3'] : ['mp3'];
    
    currentSound.current = new Howl({
      src: [streamUrl],
      html5: true, // Required for streaming
      format: formats,
      autoplay: false,
      preload: 'metadata', // Changed from true to metadata for better streaming
      volume: volume / 100,
      onload: () => {
        console.log(`Station loaded successfully: ${station.name}`);
        setIsLoading(false);
        setStreamError(null);
      },
      onplay: () => {
        console.log(`Station playing: ${station.name}`);
        setIsPlaying(true);
        setIsLoading(false);
        toast.success(`Now playing: ${station.name}`);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        console.error(`Error loading station ${station.name}:`, error);
        setIsLoading(false);
        
        // For M3U8 streams, try HTML5 Audio as fallback
        if (isM3U8) {
          console.log(`M3U8 failed in Howler, trying HTML5 Audio for ${station.name}`);
          tryHtml5AudioFallback(streamUrl, station, volume, setIsLoading, setStreamError, setIsPlaying);
        } else if (station.fallbackUrl && station.fallbackUrl !== streamUrl) {
          console.log(`Trying fallback URL for ${station.name}: ${station.fallbackUrl}`);
          loadStationWithUrl(station.fallbackUrl, station, volume, currentSound, setIsLoading, setStreamError, setIsPlaying);
        } else {
          setStreamError(`Failed to load ${station.name} - Stream may be offline`);
          toast.error(`Unable to connect to ${station.name}`);
        }
      },
      onplayerror: (id, error) => {
        console.error(`Error playing station ${station.name}:`, error);
        setIsPlaying(false);
        
        // Try to resume audio context if suspended
        try {
          if (currentSound.current && currentSound.current._sounds && currentSound.current._sounds[0]) {
            const audioContext = currentSound.current._sounds[0]._node?.context;
            if (audioContext && audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                console.log('Audio context resumed, retrying play');
                if (currentSound.current) {
                  currentSound.current.play();
                }
              }).catch(e => {
                console.error('Failed to resume audio context:', e);
                setStreamError(`Playback blocked - please interact with the page first`);
              });
            } else {
              setStreamError(`Failed to play ${station.name} - try the Force Play button`);
            }
          }
        } catch (e) {
          console.error('Error handling play error:', e);
          setStreamError(`Playback error for ${station.name}`);
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    setIsLoading(false);
    setStreamError("Failed to initialize audio player");
  }
}

// Helper function to load station with specific URL
function loadStationWithUrl(
  url: string,
  station: RadioStation,
  volume: number,
  currentSound: MutableRefObject<Howl | null>,
  setIsLoading: (loading: boolean) => void,
  setStreamError: (error: string | null) => void,
  setIsPlaying: (playing: boolean) => void
) {
  if (currentSound.current) {
    currentSound.current.unload();
  }
  
  const isM3U8 = url.includes('.m3u8');
  const formats = isM3U8 ? ['m3u8', 'mp3'] : ['mp3'];
  
  currentSound.current = new Howl({
    src: [url],
    html5: true,
    format: formats,
    autoplay: false,
    preload: 'metadata',
    volume: volume / 100,
    onload: () => {
      setIsLoading(false);
      setStreamError(null);
    },
    onplay: () => {
      setIsPlaying(true);
      setIsLoading(false);
      toast.success(`Now playing: ${station.name} (fallback stream)`);
    },
    onloaderror: () => {
      setIsLoading(false);
      setStreamError(`All streams failed for ${station.name}`);
      toast.error(`Unable to connect to any stream for ${station.name}`);
    }
  });
}

// HTML5 Audio fallback for M3U8 streams
function tryHtml5AudioFallback(
  url: string,
  station: RadioStation,
  volume: number,
  setIsLoading: (loading: boolean) => void,
  setStreamError: (error: string | null) => void,
  setIsPlaying: (playing: boolean) => void
) {
  console.log(`Trying HTML5 Audio fallback for: ${url}`);
  
  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.preload = 'metadata';
  audio.volume = volume / 100;
  audio.src = url;
  
  audio.addEventListener('loadstart', () => {
    console.log('HTML5 Audio: Load started');
  });
  
  audio.addEventListener('canplay', () => {
    console.log('HTML5 Audio: Can play');
    setIsLoading(false);
    setStreamError(null);
    toast.success(`${station.name} ready (HTML5 mode)`);
  });
  
  audio.addEventListener('play', () => {
    setIsPlaying(true);
    toast.success(`Now playing: ${station.name} (HTML5 mode)`);
  });
  
  audio.addEventListener('pause', () => {
    setIsPlaying(false);
  });
  
  audio.addEventListener('error', (e) => {
    console.error('HTML5 Audio error:', e);
    setIsLoading(false);
    setStreamError(`${station.name} stream unavailable - may be offline`);
    toast.error(`Unable to play ${station.name} - stream may be offline`);
  });
  
  // Store reference for cleanup (you may want to add this to your state management)
  (window as any).fallbackAudio = audio;
}

// Preload next and previous stations for faster switching
export function preloadAdjacentStations(
  stations: RadioStation[],
  currentStationIndex: number,
  nextSound: MutableRefObject<Howl | null>,
  previousSound: MutableRefObject<Howl | null>
) {
  const nextIndex = (currentStationIndex + 1) % stations.length;
  const prevIndex = (currentStationIndex - 1 + stations.length) % stations.length;
  
  // Preload next station
  if (nextSound.current) {
    nextSound.current.unload();
  }
  
  const nextStation = stations[nextIndex];
  const nextUrl = nextStation.streamUrl || nextStation.url;
  const nextIsM3U8 = nextUrl.includes('.m3u8');
  
  nextSound.current = new Howl({
    src: [nextUrl],
    html5: true,
    autoplay: false,
    preload: 'metadata',
    volume: 0,
    format: nextIsM3U8 ? ['m3u8', 'mp3'] : ['mp3']
  });
  
  // Preload previous station
  if (previousSound.current) {
    previousSound.current.unload();
  }
  
  const prevStation = stations[prevIndex];
  const prevUrl = prevStation.streamUrl || prevStation.url;
  const prevIsM3U8 = prevUrl.includes('.m3u8');
  
  previousSound.current = new Howl({
    src: [prevUrl],
    html5: true,
    autoplay: false,
    preload: 'metadata',
    volume: 0,
    format: prevIsM3U8 ? ['m3u8', 'mp3'] : ['mp3']
  });
}
