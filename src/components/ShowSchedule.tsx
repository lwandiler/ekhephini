
import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeContext } from '@/contexts/ThemeContext';

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
        id: 17,
        title: "Nethezeka Nathi",
        host: "TBA",
        time: "9:00 AM - 12:00 PM",
        description: "Join us for an engaging morning show with great music and local content."
      },
      {
        id: 22,
        title: "Re Mmogo",
        host: "TBA",
        time: "12:00 PM - 3:00 PM",
        description: "Join us together for an afternoon of great music and community conversations."
      },
      {
        id: 27,
        title: "Merithing Afternoon Drive Show",
        host: "TBA",
        time: "3:00 PM - 6:00 PM",
        description: "Your perfect companion for the afternoon drive with great music and entertainment."
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
        id: 18,
        title: "Nethezeka Nathi",
        host: "TBA",
        time: "9:00 AM - 12:00 PM",
        description: "Join us for an engaging morning show with great music and local content."
      },
      {
        id: 23,
        title: "Re Mmogo",
        host: "TBA",
        time: "12:00 PM - 3:00 PM",
        description: "Join us together for an afternoon of great music and community conversations."
      },
      {
        id: 28,
        title: "Merithing Afternoon Drive Show",
        host: "TBA",
        time: "3:00 PM - 6:00 PM",
        description: "Your perfect companion for the afternoon drive with great music and entertainment."
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
        id: 19,
        title: "Nethezeka Nathi",
        host: "TBA",
        time: "9:00 AM - 12:00 PM",
        description: "Join us for an engaging morning show with great music and local content."
      },
      {
        id: 24,
        title: "Re Mmogo",
        host: "TBA",
        time: "12:00 PM - 3:00 PM",
        description: "Join us together for an afternoon of great music and community conversations."
      },
      {
        id: 29,
        title: "Merithing Afternoon Drive Show",
        host: "TBA",
        time: "3:00 PM - 6:00 PM",
        description: "Your perfect companion for the afternoon drive with great music and entertainment."
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
        id: 20,
        title: "Nethezeka Nathi",
        host: "TBA",
        time: "9:00 AM - 12:00 PM",
        description: "Join us for an engaging morning show with great music and local content."
      },
      {
        id: 25,
        title: "Re Mmogo",
        host: "TBA",
        time: "12:00 PM - 3:00 PM",
        description: "Join us together for an afternoon of great music and community conversations."
      },
      {
        id: 30,
        title: "Merithing Afternoon Drive Show",
        host: "TBA",
        time: "3:00 PM - 6:00 PM",
        description: "Your perfect companion for the afternoon drive with great music and entertainment."
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
        id: 21,
        title: "Nethezeka Nathi",
        host: "TBA",
        time: "9:00 AM - 12:00 PM",
        description: "Join us for an engaging morning show with great music and local content."
      },
      {
        id: 26,
        title: "Re Mmogo",
        host: "TBA",
        time: "12:00 PM - 3:00 PM",
        description: "Join us together for an afternoon of great music and community conversations."
      },
      {
        id: 31,
        title: "Merithing Afternoon Drive Show",
        host: "TBA",
        time: "3:00 PM - 6:00 PM",
        description: "Your perfect companion for the afternoon drive with great music and entertainment."
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
  const { themeOptions, isDarkMode } = useContext(ThemeContext);
  const [currentDay, setCurrentDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  });

  return (
    <div className={`bg-card rounded-lg shadow-md p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-foreground'}`}>Show Schedule</h2>
      
      <Tabs defaultValue={currentDay} className="w-full">
        <TabsList className={`grid grid-cols-7 mb-6 overflow-x-auto ${isDarkMode ? 'bg-gray-700' : 'bg-muted'}`}>
          {mockSchedule.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day}
              className={`data-[state=active]:bg-sky-200 data-[state=active]:text-sky-800 dark:data-[state=active]:bg-sky-900 dark:data-[state=active]:text-sky-100 ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}
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
                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-l-4 border-primary rounded-r-md transition-colors ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-muted/20 hover:bg-muted/40'}`}
              >
                <div className="mb-3 md:mb-0">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-foreground'}`}>{show.title}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>with {show.host}</p>
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
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShowSchedule;
