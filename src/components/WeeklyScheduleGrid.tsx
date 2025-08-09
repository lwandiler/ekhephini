import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Show {
  id: string;
  title: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description: string | null;
  status: string;
}

const WeeklyScheduleGrid = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data: showsData, error } = await supabase
          .from('shows')
          .select('*')
          .order('start_time');

        if (error) {
          console.error('Error fetching shows:', error);
          return;
        }

        setShows(showsData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: false 
      });
    } catch {
      return time;
    }
  };

  const getShowForTimeSlot = (day: string, timeSlot: string): Show | null => {
    return shows.find(show => {
      if (show.day_of_week?.toLowerCase() !== day.toLowerCase()) return false;
      
      const showStart = show.start_time;
      const showEnd = show.end_time;
      const slotTime = timeSlot;
      
      return showStart <= slotTime && showEnd > slotTime;
    }) || null;
  };

  const isCurrentShow = (show: Show): boolean => {
    const now = new Date();
    const currentDay = daysOfWeek[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Monday start
    const currentTime = now.toTimeString().slice(0, 5);
    
    return show.day_of_week?.toLowerCase() === currentDay.toLowerCase() &&
           show.start_time <= currentTime && 
           show.end_time > currentTime;
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Weekly Schedule</h2>
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            Weekly Schedule
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your complete weekly programming guide. All times shown in 24-hour format.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <CardTitle className="text-center">Programming Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold min-w-[120px]">Day</th>
                    {timeSlots.map(time => (
                      <th key={time} className="p-4 text-center font-semibold min-w-[140px]">
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map(day => (
                    <tr key={day} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium bg-muted/20 sticky left-0">
                        {day}
                      </td>
                      {timeSlots.map(timeSlot => {
                        const show = getShowForTimeSlot(day, timeSlot);
                        const isCurrent = show ? isCurrentShow(show) : false;
                        
                        return (
                          <td key={`${day}-${timeSlot}`} className="p-2 text-center">
                            {show ? (
                              <div 
                                className={`p-3 rounded-lg border transition-all hover:shadow-md hover:scale-105 cursor-pointer ${
                                  isCurrent 
                                    ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary ring-2 ring-primary/30' 
                                    : 'bg-gradient-to-br from-muted/50 to-background border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-sm truncate">{show.title}</h4>
                                  {isCurrent && (
                                    <Badge variant="destructive" className="text-xs ml-1">
                                      LIVE
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-1">{show.host}</p>
                                <p className="text-xs font-mono">
                                  {formatTime(show.start_time)} - {formatTime(show.end_time)}
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-muted/20 border border-dashed border-muted-foreground/20">
                                <p className="text-xs text-muted-foreground">No Show</p>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Schedule updates automatically • Live shows highlighted in color
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklyScheduleGrid;