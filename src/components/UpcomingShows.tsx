import React from 'react';
import { useUpcomingShows } from '@/hooks/useUpcomingShows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';

export default function UpcomingShows() {
  const { upcomingShows, loading } = useUpcomingShows();

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (upcomingShows.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600">No upcoming shows scheduled. Check back later!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold tracking-wider uppercase text-sm">Coming Up Next</span>
          <h2 className="text-4xl font-bold mt-2 text-gray-900">Upcoming Shows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingShows.map((show, index) => (
            <Card key={show.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-gray-200 group">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  {show.image_url ? (
                    <img 
                      src={show.image_url} 
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center">
                      <User className="w-16 h-16 text-green-600 mx-auto mb-2" />
                      <div className="text-green-600 font-semibold">UPCOMING SHOW</div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                  {index === 0 ? 'UP NEXT' : `${index + 1}${index === 1 ? 'nd' : 'rd'} UP`}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-gray-900 line-clamp-2">
                  {show.title}
                </CardTitle>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <User className="w-4 h-4 mr-1" />
                  {show.host}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {show.description || "Join us for another exciting episode of this amazing show."}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{show.time}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{show.day_of_week}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}