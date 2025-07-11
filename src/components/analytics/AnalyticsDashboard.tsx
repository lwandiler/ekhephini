
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListenerStatsChart from './ListenerStatsChart';
import DemographicsChart from './DemographicsChart';
import PopularContentChart from './PopularContentChart';
import GeographicMap from './GeographicMap';
import DeviceUsageChart from './DeviceUsageChart';
import ListeningHoursChart from './ListeningHoursChart';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Listeners</CardTitle>
            <CardDescription>Active users in selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24,892</div>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <span>↑ 8.2%</span>
              <span className="text-gray-500 ml-1">vs previous period</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Listening Time</CardTitle>
            <CardDescription>Time spent per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1h 24m</div>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <span>↑ 12.5%</span>
              <span className="text-gray-500 ml-1">vs previous period</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Most Popular Show</CardTitle>
            <CardDescription>Based on listening data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">Evening Vibes</div>
            <p className="text-sm text-gray-500 mt-1">8,932 listeners this week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Listener Growth</CardTitle>
            <CardDescription>Daily listener count over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ListenerStatsChart />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Where your listeners are located</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <GeographicMap />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
            <CardDescription>Age and gender distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <DemographicsChart />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Content</CardTitle>
            <CardDescription>Top shows by listening time</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <PopularContentChart />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>What devices listeners use</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <DeviceUsageChart />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Listening Hours</CardTitle>
            <CardDescription>When your audience tunes in</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ListeningHoursChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
