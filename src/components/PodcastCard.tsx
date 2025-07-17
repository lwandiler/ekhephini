
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Download, Share2, Bookmark, Play, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Podcast {
  id: number;
  title: string;
  host: string;
  description: string;
  image: string;
  duration: string;
  publishDate: string;
  episodeNumber: number;
  listenUrl: string;
}

interface PodcastCardProps {
  podcast: Podcast;
  variant?: 'default' | 'compact' | 'featured';
  onPlay?: (podcast: Podcast) => void;
}

const PodcastCard = ({ podcast, variant = 'default', onPlay }: PodcastCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Check if podcast is liked on component mount
  useEffect(() => {
    const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]');
    setIsLiked(likedPodcasts.includes(podcast.id));
  }, [podcast.id]);
  
  // Use realistic podcast images if the image is placeholder.svg
  const podcastImage = podcast.image === "/placeholder.svg" 
    ? `https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80&random=${podcast.id}` 
    : podcast.image;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(podcast);
    } else if (podcast.listenUrl && podcast.listenUrl !== '#') {
      window.open(podcast.listenUrl, '_blank');
    }
  };

  const handleDownloadClick = () => {
    if (podcast.listenUrl && podcast.listenUrl !== '#') {
      const link = document.createElement('a');
      link.href = podcast.listenUrl;
      link.download = `${podcast.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLikeClick = () => {
    const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]');
    let updatedLikes;
    
    if (isLiked) {
      updatedLikes = likedPodcasts.filter((id: number) => id !== podcast.id);
    } else {
      updatedLikes = [...likedPodcasts, podcast.id];
    }
    
    localStorage.setItem('likedPodcasts', JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gray-900 border-gray-800 text-white">
        <div className="flex items-center p-4">
          <img 
            src={podcastImage} 
            alt={podcast.title} 
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div className="flex-1">
            <CardTitle className="text-md text-white">{podcast.title}</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              Episode {podcast.episodeNumber} • {podcast.duration}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              className={`rounded-full ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
              onClick={handleLikeClick}
            >
              <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-green-400 hover:text-white hover:bg-green-600 rounded-full"
              onClick={handlePlayClick}
            >
              <Play size={18} fill="currentColor" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-900 to-gray-900 text-white border-green-800">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 relative group">
            <img 
              src={podcastImage} 
              alt={podcast.title} 
              className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent md:bg-gradient-to-t md:from-black/80 md:via-black/40 md:to-transparent"></div>
            <Button 
              variant="default" 
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white h-16 w-16 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={handlePlayClick}
            >
              <Play size={30} fill="currentColor" />
            </Button>
          </div>
          <div className="md:w-3/5 p-6">
            <div className="flex items-center mb-4">
              <span className="text-xs font-medium bg-green-600 px-3 py-1 rounded-full text-white">
                FEATURED EPISODE
              </span>
            </div>
            <CardTitle className="text-2xl mb-2 text-white">{podcast.title}</CardTitle>
            <CardDescription className="text-green-300 mb-2">
              Hosted by {podcast.host} • Episode {podcast.episodeNumber}
            </CardDescription>
            <p className="mb-4 text-gray-300">{podcast.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{podcast.duration} • {formatDate(podcast.publishDate)}</span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`border-green-400 hover:bg-green-700 hover:text-white ${isLiked ? 'text-red-400' : 'text-green-300'}`}
                  onClick={handleLikeClick}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} className="mr-1" />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-700 hover:text-white"
                  onClick={handlePlayClick}
                >
                  <Headphones size={16} className="mr-1" />
                  Listen
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-400 text-green-300 hover:bg-green-700 hover:text-white"
                  onClick={handleDownloadClick}
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800 text-white h-full flex flex-col group">
      <div className="relative">
        <img 
          src={podcastImage} 
          alt={podcast.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60"></div>
        <Button 
          variant="default" 
          size="icon" 
          className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 text-white h-8 w-8 rounded-full"
          onClick={() => setIsSaved(!isSaved)}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium bg-green-600 text-white px-2 py-1 rounded-full">
            Episode {podcast.episodeNumber}
          </span>
        </div>
        <CardTitle className="text-xl text-white">
          {podcast.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-400">
          Hosted by {podcast.host} • {podcast.duration}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-gray-300">{podcast.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3 border-t border-gray-800">
        <span className="text-sm text-gray-400">{formatDate(podcast.publishDate)}</span>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={`rounded-full ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            onClick={handleLikeClick}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-green-400 hover:text-white hover:bg-green-700 h-8 w-8 rounded-full"
            onClick={handleDownloadClick}
          >
            <Download size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-green-400 hover:text-white hover:bg-green-700 h-8 w-8 rounded-full"
          >
            <Share2 size={16} />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            onClick={handlePlayClick}
          >
            <Play size={16} fill="currentColor" className="mr-1" />
            Listen
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PodcastCard;
