
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import ListenerStatsChart from './ListenerStatsChart';
import DemographicsChart from './DemographicsChart';
import PopularContentChart from './PopularContentChart';
import GeographicMap from './GeographicMap';
import DeviceUsageChart from './DeviceUsageChart';
import ListeningHoursChart from './ListeningHoursChart';
import { Skeleton } from '@/components/ui/skeleton';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState(30);
  const analytics = useAnalytics(timeframe);
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (analytics.error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Error loading analytics: {analytics.error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your database connection and ensure analytics tables are set up correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Listeners</CardTitle>
            <CardDescription>Active users in last {timeframe} days</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className="text-3xl font-bold">{analytics.totalListeners.toLocaleString()}</div>
            )}
            {analytics.isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                {analytics.totalListeners === 0 ? 'No data available yet' : 'Unique sessions recorded'}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Listening Time</CardTitle>
            <CardDescription>Time spent per session</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-3xl font-bold">
                {analytics.avgListeningTime > 0 ? formatDuration(analytics.avgListeningTime) : '0m'}
              </div>
            )}
            {analytics.isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                {analytics.avgListeningTime === 0 ? 'No listening data yet' : 'Average session duration'}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Most Popular Show</CardTitle>
            <CardDescription>Based on listening data</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-xl font-semibold">
                  {analytics.mostPopularShow || 'No data'}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics.mostPopularShowListeners > 0 
                    ? `${analytics.mostPopularShowListeners} listeners this week`
                    : 'No show data available yet'
                  }
                </p>
              </>
            )}
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
              <ListenerStatsChart data={analytics.listenerGrowth} isLoading={analytics.isLoading} />
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
              <GeographicMap data={analytics.geographicData} isLoading={analytics.isLoading} />
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
              <DemographicsChart isLoading={analytics.isLoading} />
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
              <PopularContentChart data={analytics.showStats} isLoading={analytics.isLoading} />
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
              <DeviceUsageChart data={analytics.deviceStats} isLoading={analytics.isLoading} />
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
              <ListeningHoursChart data={analytics.listeningHours} isLoading={analytics.isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
