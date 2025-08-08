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
        <Card className={`h-full transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-muted/50 to-muted/30 border-dashed border-2 ${isActive ? 'border-primary/50' : 'border-muted-foreground/20'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
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

    const getCardStyles = () => {
      if (isActive) {
        return "h-full transition-all duration-500 hover:scale-105 hover:shadow-2xl transform bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30 shadow-lg hover:shadow-primary/20 animate-pulse";
      }
      if (type === "Previous Show") {
        return "h-full transition-all duration-300 hover:scale-105 hover:shadow-xl transform bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600";
      }
      if (type === "Next Show") {
        return "h-full transition-all duration-300 hover:scale-105 hover:shadow-xl transform bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-600";
      }
      return "h-full transition-all duration-300 hover:scale-105 hover:shadow-xl transform bg-gradient-to-br from-background to-muted/50";
    };

    const getIconColor = () => {
      if (isActive) return "text-primary";
      if (type === "Previous Show") return "text-slate-600 dark:text-slate-400";
      if (type === "Next Show") return "text-emerald-600 dark:text-emerald-400";
      return "text-muted-foreground";
    };

    const getBadgeVariant = () => {
      if (isActive) return "default";
      return "secondary";
    };

    return (
      <Card className={getCardStyles()}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-lg flex items-center gap-2 ${getIconColor()}`}>
              <Calendar className="h-5 w-5" />
              {type}
            </CardTitle>
            {isActive && (
              <Badge variant={getBadgeVariant()} className="animate-pulse bg-primary text-primary-foreground">
                🔴 LIVE
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{show.title}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-2 transition-colors hover:text-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{show.host}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">
                {formatTime(show.start_time)} - {formatTime(show.end_time)}
              </span>
            </div>
          </div>
          {show.description && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {show.description}
              </p>
            </div>
          )}
          {show.image_url && (
            <div className="mt-4 overflow-hidden rounded-lg">
              <img 
                src={show.image_url} 
                alt={show.title}
                className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
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
    <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-[100px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-6 shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Show Schedule
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay up-to-date with our programming schedule. Here's what was on, what's currently playing, and what's coming up next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ShowCard show={previousShow} type="Previous Show" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ShowCard show={currentShow} type="Current Show" isActive={true} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ShowCard show={nextShow} type="Next Show" />
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-muted-foreground font-medium">
              Schedule updates in real-time • Times shown in your local timezone
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowScheduleSection;