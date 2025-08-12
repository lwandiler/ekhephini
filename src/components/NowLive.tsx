import React from 'react';
import { useCurrentShow } from '@/hooks/useCurrentShow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Radio, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';

export default function NowLive() {
  const { currentShow, loading } = useCurrentShow();
  const { isPlaying, togglePlayPause } = useAudioPlayer();

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Live Broadcasting</span>
            <h2 className="text-4xl font-bold mt-2 text-foreground">Now Live</h2>
          </div>
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-64"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Live Broadcasting</span>
          <h2 className="text-4xl font-bold mt-2 text-foreground">Now Live</h2>
        </div>

        <div className="mb-12">
          {currentShow ? (
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-900 to-gray-900 text-white border-green-800">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative group">
                   <div className="w-full h-64 md:h-full bg-gradient-to-br from-green-600/30 to-green-800/10 flex items-center justify-center">
                     <div className="text-center">
                       <Radio className="w-16 h-16 text-green-400 mx-auto mb-4" />
                       <div className="text-green-400 font-semibold">LIVE RADIO</div>
                     </div>
                  </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent md:bg-gradient-to-t md:from-gray-900/80 md:via-gray-900/40 md:to-transparent"></div>
                   <Button 
                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white h-16 w-16 rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300"
                     onClick={() => {
                       if (!isPlaying) togglePlayPause();
                     }}
                   >
                     <Play className="w-8 h-8" fill="currentColor" />
                  </Button>
                   <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white animate-pulse">
                     LIVE
                   </Badge>
                </div>
                <div className="md:w-3/5 p-6">
                   <div className="flex items-center mb-4">
                     <Badge className="bg-green-600 text-white">
                       NOW PLAYING
                     </Badge>
                  </div>
                   <CardTitle className="text-2xl mb-2 text-white">
                     {currentShow.title}
                   </CardTitle>
                   <p className="text-green-300 mb-2">
                     {currentShow.host && `Hosted by ${currentShow.host} • `}
                     {currentShow.time}
                   </p>
                   <p className="mb-4 text-gray-300">
                    {currentShow.description || "Tune in to our live radio broadcast featuring the best music and entertainment."}
                  </p>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4 text-gray-300">
                       <div className="flex items-center">
                         <Clock className="w-4 h-4 mr-1" />
                         <span className="text-sm">{currentShow.time}</span>
                       </div>
                       <div className="flex items-center">
                         <Calendar className="w-4 h-4 mr-1" />
                         <span className="text-sm">{currentShow.day_of_week}</span>
                       </div>
                     </div>
                     <div className="flex space-x-2">
                       <Button 
                         className="bg-green-600 hover:bg-green-700 text-white"
                         onClick={() => {
                           if (!isPlaying) togglePlayPause();
                         }}
                       >
                         <Radio className="mr-2 w-4 h-4" />
                         Listen Live
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-muted/50 to-muted border-muted-foreground/20">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative group">
                  <div className="w-full h-64 md:h-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                    <div className="text-center">
                      <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <div className="text-muted-foreground font-semibold">OFFLINE</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent md:bg-gradient-to-t md:from-background/80 md:via-background/40 md:to-transparent"></div>
                   <Button 
                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-muted hover:bg-muted/90 text-muted-foreground h-16 w-16 rounded-full opacity-90 group-hover:opacity-100 transition-all duration-300"
                     onClick={() => {
                       if (!isPlaying) togglePlayPause();
                     }}
                   >
                     <Play className="w-8 h-8" fill="currentColor" />
                  </Button>
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-center mb-4">
                    <Badge variant="secondary">
                      CURRENTLY OFFLINE
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 text-foreground">
                    No Live Show Currently
                  </CardTitle>
                  <p className="text-muted-foreground mb-2">
                    Check back later for live programming
                  </p>
                  <p className="mb-4 text-muted-foreground">
                    While we're offline, you can still enjoy our podcast archive and upcoming show schedule.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <span className="text-sm">Next show starts soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}