import { supabaseApi } from './api/config';

// Mock API service for chart data (replace with real API integration when available)
import { ChartData, TrackData } from '@/types/charts';

// Note: Since there's no charts table in the database yet, keeping mock data for now
// but structured to easily switch to real API calls when charts table is added

export async function fetchTopTracks(period: 'weekly' | 'monthly'): Promise<ChartData> {
  // TODO: Replace with real API call when charts table is implemented
  // Example of how it would look:
  // const response = await supabaseApi.get('/charts', {
  //   params: { period: `eq.${period}` }
  // });
  // return response.data;

  // For now, return mock data but simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weekly: generateMockChartData(20, 'weekly'),
        monthly: generateMockChartData(30, 'monthly')
      });
    }, 800);
  });
}

// Helper function to generate mock data for development
function generateMockChartData(count: number, period: string): TrackData[] {
  const artists = [
    'The Weekend', 'Taylor Swift', 'Drake', 'Billie Eilish', 
    'Post Malone', 'Dua Lipa', 'Ed Sheeran', 'Ariana Grande',
    'Justin Bieber', 'Bad Bunny', 'BTS', 'Olivia Rodrigo',
    'Kendrick Lamar', 'Harry Styles', 'SZA', 'Travis Scott'
  ];
  
  const trackNames = [
    'Blinding Lights', 'Anti-Hero', 'One Dance', 'Bad Guy',
    'Circles', 'Levitating', 'Shape of You', 'Thank U, Next',
    'Stay', 'Dákiti', 'Dynamite', 'Drivers License', 
    'Humble', 'As It Was', 'Kill Bill', 'Sicko Mode',
    'Sunflower', 'Good 4 U', 'Starboy', 'Heat Waves',
    'Save Your Tears', 'Montero', 'Watermelon Sugar', 'Therefore I Am',
    'Shivers', 'Positions', 'Peaches', 'Easy On Me'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const artistIndex = Math.floor(Math.random() * artists.length);
    const trackIndex = Math.floor(Math.random() * trackNames.length);
    
    // Generate random movement between -5 and +5 (0 means no change)
    const movement = Math.floor(Math.random() * 11) - 5;
    
    // Calculate previous position (0 means new entry)
    const position = i + 1;
    const prevPosition = movement === 0 
      ? position  // No change
      : movement > 0 
        ? position + movement // Moved up (previous position was lower)
        : position - movement; // Moved down (previous position was higher)

    // For some tracks, mark as new entries
    const isNewEntry = Math.random() < 0.15;
    
    return {
      id: `track-${period}-${i + 1}`,
      position: position,
      prevPosition: isNewEntry ? 0 : prevPosition,
      movement: isNewEntry ? position : movement,
      title: trackNames[trackIndex],
      artist: artists[artistIndex],
      album: `${trackNames[trackIndex]} (Album)`,
      plays: Math.floor(Math.random() * 500) + 100,
      artwork: `https://picsum.photos/seed/${trackIndex}${artistIndex}/200/200`
    };
  });
}
