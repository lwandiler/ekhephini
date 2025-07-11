
import React, { useRef, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFallbackMode } from "@/hooks/useFallbackMode";

interface BannerMediaProps {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
}

const BannerMedia: React.FC<BannerMediaProps> = ({ mediaType, mediaUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(mediaType === 'video');
  const { toast } = useToast();
  const { fallbackMode, handleError, switchToFallbackMode } = useFallbackMode(false);

  // Force video playback when component mounts or URL changes
  useEffect(() => {
    if (mediaType !== 'video' || fallbackMode) return;
    
    setIsLoading(true);
    console.log(`Setting up video with URL: ${mediaUrl}`);
    
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Reset video element completely
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load();
    
    // Set up video properties
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.preload = "auto";
    
    // Apply source to the video element
    videoElement.src = mediaUrl;
    videoElement.load();
    
    // Create a timeout to handle loading state
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.log("Loading timeout reached, continuing anyway");
      }
    }, 5000);
    
    // Attempt to play with a slight delay
    const playTimer = setTimeout(() => {
      console.log("Attempting to play video now");
      
      try {
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playback started successfully");
              setIsLoading(false);
            })
            .catch((error) => {
              console.error("Video playback failed:", error);
              setIsLoading(false);
              
              // Show toast and attempt to play one more time
              toast({
                title: "Video playback issue",
                description: "Trying alternative approach",
              });
              
              // Second attempt with a delay
              setTimeout(() => {
                videoElement.src = mediaUrl;
                videoElement.load();
                
                videoElement.play()
                  .then(() => console.log("Second attempt successful"))
                  .catch((e) => {
                    console.error("Second attempt failed:", e);
                    handleError();
                  });
              }, 1000);
            });
        }
      } catch (err) {
        console.error("Error during play attempt:", err);
        handleError();
        setIsLoading(false);
      }
    }, 300);
    
    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(playTimer);
      
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
      }
    };
  }, [mediaType, mediaUrl, fallbackMode, toast]);
  
  // Handle video events
  const handleVideoLoaded = () => {
    console.log("Video loaded event fired");
    setIsLoading(false);
    
    // Try to play again when loaded
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => console.log("Play on load successful"))
        .catch(err => {
          console.error("Play on load failed:", err);
          handleError();
        });
    }
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error event:", e);
    handleError();
    setIsLoading(false);
    
    toast({
      title: "Video Error",
      description: "The video could not be loaded. Showing fallback content.",
      variant: "destructive",
    });
  };

  // Display fallback image if in fallback mode or video has an error
  if (mediaType === 'video' && fallbackMode) {
    return (
      <div className="relative w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&h=600&q=80"
          alt={title} 
          className="w-full h-full object-cover" 
          loading="eager"
        />
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={switchToFallbackMode} 
            className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
          >
            <span>Video unavailable</span>
          </button>
        </div>
      </div>
    );
  }

  // Display video element
  if (mediaType === 'video') {
    return (
      <div className="relative w-full h-full">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          data-testid="banner-video"
          poster="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&h=600&q=80"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
  
  // Display image
  return (
    <img 
      src={mediaUrl} 
      alt={title} 
      className="w-full h-full object-cover" 
      loading="eager"
    />
  );
};

export default BannerMedia;
