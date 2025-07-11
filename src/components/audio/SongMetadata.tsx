
import React from 'react';
import { Music, Disc } from 'lucide-react';

export interface SongMetadataProps {
  artist?: string;
  title?: string;
  albumCover?: string;
  isLoading: boolean;
  isPlaying: boolean;
}

const SongMetadata: React.FC<SongMetadataProps> = ({
  artist,
  title,
  albumCover,
  isLoading,
  isPlaying
}) => {
  // When there's no metadata yet
  if (!artist && !title) {
    return (
      <div className="flex items-center">
        <Disc 
          size={16} 
          className={`mr-2 text-blue-300 ${isPlaying && !isLoading ? 'animate-spin' : ''}`} 
        />
        <span className="text-sm text-white text-shadow-sm italic">
          {isLoading ? 'Loading metadata...' : 'Metadata unavailable'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {/* Album cover or music icon */}
      <div className="mr-2 flex-shrink-0">
        {albumCover ? (
          <img 
            src={albumCover} 
            alt="Album Cover"
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Music size={16} className={`text-blue-300 ${albumCover ? 'hidden' : ''}`} />
      </div>
      
      <div className="overflow-hidden">
        <div className="flex flex-col">
          {title && (
            <span className="font-medium text-sm truncate max-w-[200px] animate-marquee text-white text-shadow-sm">
              {title}
            </span>
          )}
          {artist && (
            <span className="text-xs text-gray-200 text-shadow-sm truncate max-w-[200px]">
              {artist}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongMetadata;
