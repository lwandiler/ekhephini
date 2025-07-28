
import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ThemeContext } from '@/contexts/ThemeContext';
import { AudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { fetchShows, type DaySchedule, type ShowWithFormattedTime } from '@/services/api/showsService';
import { hasShowPassed, getNextShowOccurrence } from '@/utils/scheduleUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShowSchedule = () => {
  const { themeOptions } = useContext(ThemeContext);
  const [currentDay, setCurrentDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<ShowWithFormattedTime | null>(null);
  const { toast } = useToast();
  
  const { togglePlayPause, isPlaying } = useContext(AudioPlayerContext);

  const isShowCurrentlyHappening = (show: ShowWithFormattedTime): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Check if it's the right day
    const showDay = schedule.find(day => day.shows.some(s => s.id === show.id))?.day;
    if (showDay !== currentDay) return false;
    
    // Parse show times
    const startTime = parseTimeToMinutes(show.start_time);
    const endTime = parseTimeToMinutes(show.end_time);
    
    // Handle shows that cross midnight
    if (endTime < startTime) {
      return currentTime >= startTime || currentTime < endTime;
    } else {
      return currentTime >= startTime && currentTime < endTime;
    }
  };

  const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getNextShowTime = (show: ShowWithFormattedTime): string => {
    const showDay = schedule.find(day => day.shows.some(s => s.id === show.id))?.day;
    if (!showDay) return show.time;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = daysOfWeek.indexOf(today);
    const showDayIndex = daysOfWeek.indexOf(showDay);
    
    if (showDayIndex === todayIndex) {
      return `today at ${show.time}`;
    } else if (showDayIndex === (todayIndex + 1) % 7) {
      return `tomorrow at ${show.time}`;
    } else {
      return `on ${showDay} at ${show.time}`;
    }
  };

  const handleListenClick = (show: ShowWithFormattedTime) => {
    if (isShowCurrentlyHappening(show)) {
      // Show is live, start playing
      if (!isPlaying) {
        togglePlayPause();
      }
      toast({
        title: "Now Playing",
        description: `You're now listening to ${show.title} with ${show.host}`,
      });
    } else {
      // Show is not live, show dialog
      setSelectedShow(show);
      setDialogOpen(true);
    }
  };

  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchShows();
        setSchedule(data);
      } catch (err) {
        console.error('Error loading shows:', err);
        setError('Failed to load shows');
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] shadow-lg p-8">
        <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[32px] font-bold leading-normal mb-8">Show Schedule</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[30px] shadow-lg p-8">
        <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[32px] font-bold leading-normal mb-8">Show Schedule</h2>
        <div className="text-center py-8">
          <p className="text-[#5F5F5F] font-asap text-lg leading-normal">
            {error}
          </p>
          <div 
            onClick={() => window.location.reload()} 
            className="mt-6 w-[180px] h-[50px] bg-[#004D9E] rounded-[25px] flex items-center justify-center mx-auto cursor-pointer hover:bg-[#003a7a] transition-colors"
          >
            <span className="text-white font-asap text-[16px] font-bold leading-normal">
              Try Again
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] shadow-lg p-8 max-w-6xl mx-auto">
      <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[32px] font-bold leading-normal mb-8 text-center">Show Schedule</h2>
      
      <Tabs value={currentDay} onValueChange={setCurrentDay} className="w-full">
        <TabsList className="grid grid-cols-7 mb-8 bg-[#F8F9FA] rounded-[20px] p-1 overflow-x-auto">
          {schedule.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className="data-[state=active]:!bg-[#004D9E] data-[state=active]:!text-white text-[#5F5F5F] hover:text-black font-asap font-bold text-[14px] rounded-[15px] transition-colors"
            >
              {day.day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {schedule.map((day) => (
          <TabsContent key={day.day} value={day.day} className="space-y-6">
            {day.shows.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5F5F5F] font-asap text-lg">No shows scheduled for {day.day}</p>
              </div>
            ) : (
              day.shows.map((show) => (
                <div 
                  key={show.id} 
                  className="bg-[#F8F9FA] rounded-[20px] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        {isShowCurrentlyHappening(show) && (
                          <div className="bg-[#F99300] text-white px-3 py-1 rounded-[15px] font-asap text-[12px] font-bold">
                            LIVE NOW
                          </div>
                        )}
                        <h3 className="text-black font-asap text-[24px] font-bold leading-normal">{show.title}</h3>
                      </div>
                      <p className="text-[#5F5F5F] font-asap text-[16px] font-normal leading-normal mb-2">
                        Host: {show.host}
                      </p>
                      {show.description && (
                        <p className="text-[#5F5F5F] font-asap text-[14px] font-normal leading-normal">
                          {show.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="bg-[#004D9E] text-white px-4 py-2 rounded-[15px] font-asap text-[14px] font-bold">
                        {show.time}
                      </div>
                      
                      <div 
                        onClick={() => handleListenClick(show)}
                        className="w-[120px] h-[45px] bg-[#F99300] rounded-[25px] flex items-center justify-center cursor-pointer hover:bg-[#e8850a] transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8 5V19L19 12L8 5Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-white font-asap text-[14px] font-bold leading-normal">
                            Listen
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Show Not Started Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-[#004D9E] rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="text-center text-black font-asap text-[20px] font-bold">
              {selectedShow && hasShowPassed(selectedShow, schedule) ? 'Show Has Ended' : 'Show Not Started'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-black font-asap text-[16px] mb-4">
              <strong>{selectedShow?.title}</strong> with {selectedShow?.host} 
              {selectedShow && hasShowPassed(selectedShow, schedule) ? ' has already ended.' : " hasn't started yet."}
            </p>
            <p className="text-[#5F5F5F] font-asap text-[14px]">
              {selectedShow && hasShowPassed(selectedShow, schedule) 
                ? `Catch the next episode ${getNextShowOccurrence(selectedShow, schedule)}`
                : `Come back ${selectedShow ? getNextShowOccurrence(selectedShow, schedule) : ''} to listen live!`
              }
            </p>
          </div>
          <div className="flex justify-center">
            <div 
              onClick={() => setDialogOpen(false)} 
              className="w-[120px] h-[45px] bg-[#004D9E] rounded-[25px] flex items-center justify-center cursor-pointer hover:bg-[#003a7a] transition-colors"
            >
              <span className="text-white font-asap text-[14px] font-bold leading-normal">
                Got it
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowSchedule;
