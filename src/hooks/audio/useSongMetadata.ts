
import { useState, useEffect } from 'react';
import { RadioStation, SongMetadata } from './types';

export function useSongMetadata(
  isPlaying: boolean, 
  currentStation: number, 
  stations: RadioStation[]
): SongMetadata | undefined {
  const [metadata, setMetadata] = useState<SongMetadata | undefined>(undefined);

  // Effect to simulate metadata fetching when the stream is playing
  useEffect(() => {
    console.log('useSongMetadata: Effect triggered', { isPlaying, currentStation, stationsLength: stations.length });
    
    if (!isPlaying || !stations[currentStation]) {
      console.log('useSongMetadata: Clearing metadata - not playing or no station');
      setMetadata(undefined);
      return;
    }
    
    // Initial metadata based on station
    const stationName = stations[currentStation]?.name || 'Unknown Station';
    console.log('useSongMetadata: Setting initial metadata for', stationName);
    
    // Set initial metadata immediately
    setMetadata({
      artist: `${stationName}`,
      title: `Live Stream`,
      albumCover: `https://picsum.photos/300/300?random=0`
    });
    
    // Simulate periodic metadata updates with album covers
    const sampleMetadata = [
      { 
        artist: 'Groove Collective', 
        title: 'Ambient Sessions',
        albumCover: `https://picsum.photos/300/300?random=1`
      },
      { 
        artist: 'Deep Vibes', 
        title: 'Morning Chill',
        albumCover: `https://picsum.photos/300/300?random=2`
      },
      { 
        artist: 'Cosmic Waves', 
        title: 'Space Journey',
        albumCover: `https://picsum.photos/300/300?random=3`
      },
      { 
        artist: 'Urban Flow', 
        title: 'City Beats',
        albumCover: `https://picsum.photos/300/300?random=4`
      },
      { 
        artist: 'Jazz Ensemble', 
        title: 'Smooth Transitions',
        albumCover: `https://picsum.photos/300/300?random=5`
      },
      { 
        artist: 'Electronic Dreams', 
        title: 'Digital Sunset',
        albumCover: `https://picsum.photos/300/300?random=6`
      },
      { 
        artist: 'Indie Collective', 
        title: 'Alternative Waves',
        albumCover: `https://picsum.photos/300/300?random=7`
      },
      { 
        artist: 'Ambient Lounge', 
        title: 'Midnight Hour',
        albumCover: `https://picsum.photos/300/300?random=8`
      }
    ];
    
    // First update after 3 seconds
    const firstTimeout = setTimeout(() => {
      if (Math.random() > 0.2) {
        const randomIndex = Math.floor(Math.random() * sampleMetadata.length);
        const newMetadata = sampleMetadata[randomIndex];
        console.log('useSongMetadata: Updating to', newMetadata);
        setMetadata(newMetadata);
      }
    }, 3000);
    
    // Regular updates every 15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const randomIndex = Math.floor(Math.random() * sampleMetadata.length);
        const newMetadata = sampleMetadata[randomIndex];
        console.log('useSongMetadata: Periodic update to', newMetadata);
        setMetadata(newMetadata);
      }
    }, 15000);
    
    return () => {
      console.log('useSongMetadata: Cleaning up timers');
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [isPlaying, currentStation, stations]);
  
  console.log('useSongMetadata: Current metadata', metadata);
  return metadata;
}
