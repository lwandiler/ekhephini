import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Radio, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ShowSchedule = () => {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      const { data: showsData } = await supabase
        .from('shows')
        .select('*')
        .order('time_slot');
      
      if (showsData) {
        setShows(showsData);
      }
    } catch (error) {
      console.error('Error loading shows:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className="p-6 text-center">
        <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">No shows scheduled yet</p>
        <p className="text-sm text-gray-500">Check back later for our programming schedule!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <Card key={show.id} className="hover:shadow-lg transition-shadow">
            {show.image_url ? (
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={show.image_url} 
                  alt={show.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 rounded-t-lg flex items-center justify-center">
                <Radio className="w-16 h-16 text-white" />
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{show.title}</CardTitle>
                <Badge variant={show.status === 'Live' ? 'default' : 'secondary'}>
                  {show.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Host: {show.host}</span>
                </div>
                
                {show.day_of_week && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{show.day_of_week}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {show.start_time && show.end_time 
                      ? `${show.start_time} - ${show.end_time}`
                      : show.time_slot
                    }
                  </span>
                </div>
                
                {show.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {show.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Schedule Grid */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Weekly Schedule Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Card key={day} className="h-64">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm font-medium bg-green-600 text-white py-2 rounded">
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-500">
                <p>Schedule details</p>
                <p>coming soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowSchedule;