
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Download, Share2, Bookmark, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
}

const PodcastCard = ({ podcast, variant = 'default' }: PodcastCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  
  // Use realistic podcast images if the image is placeholder.svg
  const podcastImage = podcast.image === "/placeholder.svg" 
    ? `https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80&random=${podcast.id}` 
    : podcast.image;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <Button 
            variant="ghost" 
            size="icon"
            className="text-purple-400 hover:text-white hover:bg-purple-600 rounded-full"
            asChild
          >
            <Link to={podcast.listenUrl}>
              <Play size={18} fill="currentColor" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-900 to-gray-900 text-white border-purple-800">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 relative group">
            <img 
              src={podcastImage} 
              alt={podcast.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent md:bg-gradient-to-t md:from-black/80 md:via-black/40 md:to-transparent"></div>
            <Button 
              variant="default" 
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white h-16 w-16 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
              asChild
            >
              <Link to={podcast.listenUrl}>
                <Play size={30} fill="currentColor" />
              </Link>
            </Button>
          </div>
          <div className="md:w-3/5 p-6">
            <div className="flex items-center mb-4">
              <span className="text-xs font-medium bg-purple-600 px-3 py-1 rounded-full text-white">
                FEATURED EPISODE
              </span>
            </div>
            <CardTitle className="text-2xl mb-2 text-white">{podcast.title}</CardTitle>
            <CardDescription className="text-purple-300 mb-2">
              Hosted by {podcast.host} • Episode {podcast.episodeNumber}
            </CardDescription>
            <p className="mb-4 text-gray-300">{podcast.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{podcast.duration} • {formatDate(podcast.publishDate)}</span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-400 text-purple-300 hover:bg-purple-700 hover:text-white"
                  asChild
                >
                  <Link to={podcast.listenUrl}>
                    <Headphones size={16} className="mr-1" />
                    Listen
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-400 text-purple-300 hover:bg-purple-700 hover:text-white"
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
          className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white h-8 w-8 rounded-full"
          onClick={() => setIsSaved(!isSaved)}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium bg-purple-600 text-white px-2 py-1 rounded-full">
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
            className="text-purple-400 hover:text-white hover:bg-purple-700 h-8 w-8 rounded-full"
          >
            <Share2 size={16} />
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            asChild
          >
            <Link to={podcast.listenUrl}>
              <Play size={16} fill="currentColor" className="mr-1" />
              Listen
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PodcastCard;
