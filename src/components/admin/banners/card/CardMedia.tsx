
import React from 'react';
import { Video } from 'lucide-react';

interface CardMediaProps {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
}

const CardMedia: React.FC<CardMediaProps> = ({ mediaType, mediaUrl, title }) => {
  return (
    <div className="h-40 overflow-hidden relative">
      {mediaType === 'video' ? (
        <>
          <video 
            src={mediaUrl} 
            className="w-full h-full object-cover"
            muted 
          />
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
            <Video className="h-4 w-4 text-white" />
          </div>
        </>
      ) : (
        <img 
          src={mediaUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default CardMedia;
