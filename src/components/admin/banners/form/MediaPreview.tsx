
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MediaPreviewProps {
  isUploading: boolean;
  uploadProgress: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  isUploading,
  uploadProgress,
  mediaType,
  mediaUrl
}) => {
  if (isUploading) {
    return (
      <div className="mt-2">
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Uploading... {uploadProgress}%</span>
        </div>
      </div>
    );
  }
  
  if (!mediaUrl) return null;
  
  if (mediaType === 'video') {
    return (
      <div className="mt-2">
        <p className="text-sm font-medium mb-1">Preview:</p>
        <div className="rounded-md overflow-hidden border border-gray-200">
          <video 
            src={mediaUrl} 
            className="w-full h-40 object-cover" 
            autoPlay 
            muted 
            loop 
            controls
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-2">
      <p className="text-sm font-medium mb-1">Preview:</p>
      <div className="rounded-md overflow-hidden border border-gray-200">
        <img 
          src={mediaUrl} 
          alt="Banner preview" 
          className="w-full h-40 object-cover" 
        />
      </div>
    </div>
  );
};

export default MediaPreview;
