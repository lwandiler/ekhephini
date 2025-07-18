
import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ThemeContext } from '@/contexts/ThemeContext';
import { AudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { fetchShows, type DaySchedule, type ShowWithFormattedTime } from '@/services/api/showsService';
import { Skeleton } from '@/components/ui/skeleton';
import { Play } from 'lucide-react';

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
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Show Schedule</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Show Schedule</h2>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Show Schedule</h2>
      
      <Tabs value={currentDay} onValueChange={setCurrentDay} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6 overflow-x-auto bg-gray-100">
          {schedule.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className="data-[state=active]:!bg-green-800 data-[state=active]:!text-white text-gray-600 hover:text-gray-900"
            >
              {day.day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {schedule.map((day) => (
          <TabsContent key={day.day} value={day.day} className="space-y-4">
            {day.shows.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>No shows scheduled for {day.day}</p>
              </div>
            ) : (
              day.shows.map((show) => (
                <div 
                  key={show.id} 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-l-4 border-green-600 rounded-r-md transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-bold text-lg text-gray-900">{show.title}</h3>
                    <p className="text-gray-600">with {show.host}</p>
                    {show.description && (
                      <p className="text-sm mt-1 text-gray-500">
                        {show.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                      {show.time}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => handleListenClick(show)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Listen
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Show Not Started Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-white border-2 border-green-600">
          <DialogHeader>
            <DialogTitle className="text-center text-black">Show Not Started</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-black mb-4">
              <strong>{selectedShow?.title}</strong> with {selectedShow?.host} hasn't started yet.
            </p>
            <p className="text-sm text-gray-700">
              Come back {selectedShow ? getNextShowTime(selectedShow) : ''} to listen live!
            </p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => setDialogOpen(false)} className="bg-green-600 text-white hover:bg-green-700">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowSchedule;
