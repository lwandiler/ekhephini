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

  return null;
};

export default WeeklyScheduleGrid;