
import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeContext } from '@/contexts/ThemeContext';
import { fetchShows, type DaySchedule, type ShowWithFormattedTime } from '@/services/api/showsService';
import { Skeleton } from '@/components/ui/skeleton';

const ShowSchedule = () => {
  const { themeOptions, isDarkMode } = useContext(ThemeContext);
  const [currentDay, setCurrentDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className={`bg-card rounded-lg shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Show Schedule</h2>
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
      <div className={`bg-card rounded-lg shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Show Schedule</h2>
        <div className="text-center py-8">
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
    <div className={`bg-card rounded-lg shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Show Schedule</h2>
      
      <Tabs defaultValue={currentDay} className="w-full">
        <TabsList className={`grid grid-cols-7 mb-6 overflow-x-auto ${isDarkMode ? 'bg-gray-700' : 'bg-muted'}`}>
          {schedule.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className={`data-[state=active]:bg-sky-200 data-[state=active]:text-sky-800 dark:data-[state=active]:bg-sky-900 dark:data-[state=active]:text-sky-100 ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}
            >
              {day.day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {schedule.map((day) => (
          <TabsContent key={day.day} value={day.day} className="space-y-4">
            {day.shows.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>No shows scheduled for {day.day}</p>
              </div>
            ) : (
              day.shows.map((show) => (
                <div 
                  key={show.id} 
                  className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-l-4 border-primary rounded-r-md transition-colors ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-muted/20 hover:bg-muted/40'}`}
                >
                  <div className="mb-3 md:mb-0">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-foreground'}`}>{show.title}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>with {show.host}</p>
                    {show.description && (
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {show.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
                      {show.time}
                    </span>
                    
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      More Info
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShowSchedule;
