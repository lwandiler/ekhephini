import React, { useState } from 'react';
import { useUpcomingShows } from '@/hooks/useUpcomingShows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UpcomingShows() {
  const { upcomingShows, loading } = useUpcomingShows();
  const { toast } = useToast();
  const [likedShows, setLikedShows] = useState<Set<string>>(new Set());

  const handleLike = (showId: string, showTitle: string) => {
    const newLikedShows = new Set(likedShows);
    if (likedShows.has(showId)) {
      newLikedShows.delete(showId);
      toast({
        title: "Removed from favorites",
        description: `${showTitle} has been removed from your favorites.`,
      });
    } else {
      newLikedShows.add(showId);
      toast({
        title: "Added to favorites",
        description: `${showTitle} has been added to your favorites.`,
      });
    }
    setLikedShows(newLikedShows);
  };

  const handleShare = (show: any) => {
    const shareText = `Check out "${show.title}" hosted by ${show.host} on ${show.day_of_week} at ${show.time}!`;
    
    if (navigator.share) {
      navigator.share({
        title: show.title,
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Show details have been copied to your clipboard.",
        });
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Show details have been copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingShows.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No upcoming shows scheduled. Check back later!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-6 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
          <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingShows.map((show, index) => (
            <Card key={show.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-900 border-gray-800 text-white h-full flex flex-col group">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                  {show.image_url ? (
                    <img 
                      src={show.image_url} 
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center">
                      <User className="w-16 h-16 text-green-400 mx-auto mb-2" />
                      <div className="text-green-400 font-semibold">UPCOMING SHOW</div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60"></div>
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                  {index === 0 ? 'UP NEXT' : `${index + 1}${index === 1 ? 'nd' : 'rd'} UP`}
                </Badge>
                <Button 
                  className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-700 text-white h-8 w-8 rounded-full"
                  onClick={() => handleShare(show)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white line-clamp-2">
                  {show.title}
                </CardTitle>
                <div className="flex items-center text-green-400 text-sm font-medium">
                  <User className="w-4 h-4 mr-1" />
                  {show.host}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {show.description || "Join us for another exciting episode of this amazing show."}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{show.time}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{show.day_of_week}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 rounded-full p-0 ${
                      likedShows.has(show.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    onClick={() => handleLike(show.id, show.title)}
                  >
                    <Heart className={`w-4 h-4 ${likedShows.has(show.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}