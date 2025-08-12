import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';
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

  const getShowSpan = (show: Show): number => {
    const startTime = show.start_time;
    const endTime = show.end_time;
    
    const startIndex = timeSlots.findIndex(slot => slot >= startTime);
    const endIndex = timeSlots.findIndex(slot => slot >= endTime);
    
    if (startIndex === -1) return 1;
    if (endIndex === -1) return timeSlots.length - startIndex;
    
    return endIndex - startIndex;
  };

  const shouldRenderShow = (show: Show, day: string, timeSlot: string): boolean => {
    if (show.day_of_week?.toLowerCase() !== day.toLowerCase()) return false;
    
    // Only render the show in its starting time slot
    const startIndex = timeSlots.findIndex(slot => slot >= show.start_time);
    const currentIndex = timeSlots.findIndex(slot => slot === timeSlot);
    
    return startIndex === currentIndex;
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

        <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="bg-yellow-400 border-b">
            <CardTitle className="text-center text-2xl font-bold">Programming Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto relative">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="p-6 text-left font-bold text-lg w-[140px] bg-primary text-primary-foreground sticky left-0 z-30 border-r-2 border-primary/30 shadow-lg">
                      Day
                    </th>
                    {timeSlots.map(time => (
                      <th key={time} className="p-4 text-center font-semibold min-w-[160px] bg-gradient-to-b from-muted/30 to-background text-lg z-10">
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, dayIndex) => (
                    <tr key={day} className={`border-b border-muted/50 hover:bg-gradient-to-r hover:from-muted/20 hover:to-transparent transition-all duration-200 ${dayIndex % 2 === 0 ? 'bg-muted/10' : 'bg-background'}`}>
                      <td className="p-6 font-bold text-lg bg-primary text-primary-foreground sticky left-0 z-50 border-r-2 border-primary/20 w-[140px] shadow-md">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary-foreground" />
                          {day}
                        </div>
                      </td>
                       {timeSlots.map((timeSlot, timeIndex) => {
                         const show = getShowForTimeSlot(day, timeSlot);
                         const isCurrent = show ? isCurrentShow(show) : false;
                         
                         // Skip cells that are covered by a previous show's colspan
                         if (show && !shouldRenderShow(show, day, timeSlot)) {
                           return null;
                         }
                         
                         const colSpan = show ? getShowSpan(show) : 1;
                         
                         return (
                           <td key={`${day}-${timeSlot}`} className="p-3 text-center" colSpan={colSpan}>
                             {show ? (
                               <div 
                                 className={`p-4 rounded-xl border-2 transition-all duration-1000 hover:shadow-lg hover:scale-105 cursor-pointer group ${
                                   isCurrent 
                                     ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 border-primary ring-2 ring-primary/40 shadow-lg animate-pulse-light' 
                                     : 'bg-gradient-to-br from-card to-muted/30 border-border hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5'
                                 }`}
                               >
                                 <div className="flex items-center justify-between mb-2">
                                   <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{show.title}</h4>
                                   {isCurrent && (
                                     <Badge variant="destructive" className="text-xs ml-1 animate-pulse bg-red-500 text-white">
                                       LIVE
                                     </Badge>
                                   )}
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <Clock className="h-3 w-3 text-muted-foreground" />
                                   <p className="text-xs font-mono text-muted-foreground">
                                     {formatTime(show.start_time)} - {formatTime(show.end_time)}
                                   </p>
                                 </div>
                               </div>
                             ) : (
                               <div className="p-4 rounded-xl bg-gradient-to-br from-muted/10 to-muted/5 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-200">
                                 <p className="text-xs text-muted-foreground font-medium">No Show</p>
                               </div>
                             )}
                           </td>
                         );
                       }).filter(Boolean)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Schedule updates automatically • Live shows highlighted in color • Hover for show details
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklyScheduleGrid;