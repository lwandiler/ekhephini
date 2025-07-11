
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Show {
  id: number;
  title: string;
  host: string;
  time: string;
  description: string;
}

interface DaySchedule {
  day: string;
  shows: Show[];
}

const mockSchedule: DaySchedule[] = [
  {
    day: "Monday",
    shows: [
      {
        id: 1,
        title: "Morning Brew",
        host: "Sarah Johnson",
        time: "6:00 AM - 9:00 AM",
        description: "Start your day with upbeat music and interesting discussions."
      },
      {
        id: 2,
        title: "Midday Mix",
        host: "Jason Parker",
        time: "12:00 PM - 3:00 PM",
        description: "The best mix of today's hits and yesterday's classics."
      },
      {
        id: 3,
        title: "Drive Time",
        host: "Michael Rodriguez",
        time: "5:00 PM - 8:00 PM",
        description: "Your companion for the evening commute with traffic updates and great music."
      }
    ]
  },
  {
    day: "Tuesday",
    shows: [
      {
        id: 4,
        title: "Morning Brew",
        host: "Sarah Johnson",
        time: "6:00 AM - 9:00 AM",
        description: "Start your day with upbeat music and interesting discussions."
      },
      {
        id: 5,
        title: "Jazz Hour",
        host: "Robert Williams",
        time: "1:00 PM - 3:00 PM",
        description: "Two hours of smooth jazz to brighten your afternoon."
      },
      {
        id: 6,
        title: "Evening Chill",
        host: "Sophia Lee",
        time: "8:00 PM - 11:00 PM",
        description: "Wind down your day with relaxing tunes and calm conversation."
      }
    ]
  },
  {
    day: "Wednesday",
    shows: [
      {
        id: 7,
        title: "Morning Brew",
        host: "Sarah Johnson",
        time: "6:00 AM - 9:00 AM",
        description: "Start your day with upbeat music and interesting discussions."
      },
      {
        id: 8,
        title: "Local Spotlight",
        host: "David Chen",
        time: "2:00 PM - 4:00 PM",
        description: "Featuring music and interviews from local artists."
      }
    ]
  },
  {
    day: "Thursday",
    shows: [
      {
        id: 9,
        title: "Morning Brew",
        host: "Sarah Johnson",
        time: "6:00 AM - 9:00 AM",
        description: "Start your day with upbeat music and interesting discussions."
      },
      {
        id: 10,
        title: "Throwback Thursday",
        host: "Emma Wilson",
        time: "12:00 PM - 3:00 PM",
        description: "Nothing but classic hits from the 80s, 90s, and 2000s."
      }
    ]
  },
  {
    day: "Friday",
    shows: [
      {
        id: 11,
        title: "Morning Brew",
        host: "Sarah Johnson",
        time: "6:00 AM - 9:00 AM",
        description: "Start your day with upbeat music and interesting discussions."
      },
      {
        id: 12,
        title: "Weekend Kickoff",
        host: "Alex Turner",
        time: "4:00 PM - 8:00 PM",
        description: "Get your weekend started with the biggest hits and party favorites."
      }
    ]
  },
  {
    day: "Saturday",
    shows: [
      {
        id: 13,
        title: "Weekend Breakfast",
        host: "Lisa Nguyen",
        time: "8:00 AM - 11:00 AM",
        description: "A relaxed start to your weekend with easy listening music."
      },
      {
        id: 14,
        title: "Saturday Sessions",
        host: "Marcus King",
        time: "2:00 PM - 6:00 PM",
        description: "Four hours of non-stop dance and electronic music."
      }
    ]
  },
  {
    day: "Sunday",
    shows: [
      {
        id: 15,
        title: "Sunday Soul",
        host: "Aisha Jordan",
        time: "10:00 AM - 1:00 PM",
        description: "Soul and gospel music to lift your spirits."
      },
      {
        id: 16,
        title: "The Wind Down",
        host: "James Patterson",
        time: "7:00 PM - 10:00 PM",
        description: "Prepare for the week ahead with calm, reflective music."
      }
    ]
  }
];

const ShowSchedule = () => {
  const [currentDay, setCurrentDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-radio-blue mb-6">Show Schedule</h2>
      
      <Tabs defaultValue={currentDay} className="w-full">
        <TabsList className="grid grid-cols-7 bg-muted mb-6 overflow-x-auto">
          {mockSchedule.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className="data-[state=active]:bg-radio-accent data-[state=active]:text-white"
            >
              {day.day.substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {mockSchedule.map((day) => (
          <TabsContent key={day.day} value={day.day} className="space-y-4">
            {day.shows.map((show) => (
              <div 
                key={show.id} 
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-l-4 border-radio-accent bg-gray-50 rounded-r-md hover:bg-gray-100 transition-colors"
              >
                <div className="mb-3 md:mb-0">
                  <h3 className="font-bold text-lg">{show.title}</h3>
                  <p className="text-radio-muted">with {show.host}</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                  <span className="bg-radio-blue text-white px-3 py-1 rounded-md text-sm">
                    {show.time}
                  </span>
                  
                  <Button variant="outline" size="sm" className="border-radio-accent text-radio-accent hover:bg-radio-accent hover:text-white">
                    More Info
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShowSchedule;
