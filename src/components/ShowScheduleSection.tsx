import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Show {
  id: string;
  title: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description: string | null;
  image_url: string | null;
  status: string;
}

const ShowScheduleSection = () => {
  const [previousShow, setPreviousShow] = useState<Show | null>(null);
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [nextShow, setNextShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data: shows, error } = await supabase
          .from('shows')
          .select('*')
          .order('start_time');

        if (error) {
          console.error('Error fetching shows:', error);
          return;
        }

        if (!shows || shows.length === 0) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const currentDay = getDayName(now.getDay()).toLowerCase();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

        // Get today's shows
        const todayShows = shows.filter(show => 
          show.day_of_week?.toLowerCase() === getDayName(now.getDay()).toLowerCase()
        );

        // Sort shows by start time
        todayShows.sort((a, b) => a.start_time.localeCompare(b.start_time));

        let current = null;
        let previous = null;
        let next = null;

        for (let i = 0; i < todayShows.length; i++) {
          const show = todayShows[i];
          const showStart = show.start_time;
          const showEnd = show.end_time;

          if (currentTime >= showStart && currentTime <= showEnd) {
            current = show;
            previous = i > 0 ? todayShows[i - 1] : null;
            next = i < todayShows.length - 1 ? todayShows[i + 1] : null;
            break;
          } else if (currentTime < showStart) {
            next = show;
            previous = i > 0 ? todayShows[i - 1] : null;
            break;
          }
        }

        // If no current show found, set the last show as previous and first as next
        if (!current && !next) {
          previous = todayShows[todayShows.length - 1];
          next = todayShows[0];
        }

        setCurrentShow(current);
        setPreviousShow(previous);
        setNextShow(next);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const getDayName = (dayIndex: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const formatTime = (time: string): string => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch {
      return time;
    }
  };

  const ShowCard = ({ show, type, isActive = false }: { show: Show | null; type: string; isActive?: boolean }) => {
    if (!show) {
      return (
        <Card className={`h-full ${isActive ? 'border-primary bg-primary/5' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No show scheduled</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`h-full transition-all hover:shadow-lg ${isActive ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {type}
            </CardTitle>
            {isActive && <Badge variant="default">LIVE</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{show.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{show.host}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {formatTime(show.start_time)} - {formatTime(show.end_time)}
              </span>
            </div>
          </div>
          {show.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {show.description}
            </p>
          )}
          {show.image_url && (
            <div className="mt-4">
              <img 
                src={show.image_url} 
                alt={show.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Show Schedule</h2>
            <p className="text-muted-foreground">Loading shows...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shows-section" className="w-full bg-white py-16 px-4 md:px-8 lg:px-16 xl:px-[100px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-black font-asap text-2xl md:text-3xl lg:text-[40px] font-bold leading-normal mb-8">Show Schedule</h2>
          <p className="text-[#5F5F5F] font-asap text-lg md:text-xl lg:text-[25px] font-normal leading-normal max-w-2xl mx-auto">
            Stay up-to-date with our programming schedule. Here's what was on, what's currently playing, and what's coming up next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ShowCard show={previousShow} type="Previous Show" />
          <ShowCard show={currentShow} type="Current Show" isActive={true} />
          <ShowCard show={nextShow} type="Next Show" />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Schedule updates in real-time • Times shown in your local timezone
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShowScheduleSection;