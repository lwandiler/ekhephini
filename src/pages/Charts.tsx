
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChartCard from '@/components/charts/ChartCard';
import { fetchTopTracks } from '@/services/chartsService';
import ChartLoadingState from '@/components/charts/ChartLoadingState';
import ChartErrorState from '@/components/charts/ChartErrorState';
import VisualizationCard from '@/components/charts/VisualizationCard';
import ChartMovementStats from '@/components/charts/ChartMovementStats';

const Charts = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['charts', period],
    queryFn: () => fetchTopTracks(period),
  });

  if (isLoading) {
    return <ChartLoadingState />;
  }

  if (error) {
    return <ChartErrorState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-white dark:text-white">
          Click Radio Charts
        </h1>
        
        <Tabs defaultValue="weekly" className="mb-8" onValueChange={(value) => setPeriod(value as 'weekly' | 'monthly')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="weekly" className="text-white dark:text-white">Weekly Top Tracks</TabsTrigger>
            <TabsTrigger value="monthly" className="text-white dark:text-white">Monthly Top Tracks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly">
            <ChartCard title="Weekly Top Tracks" period="Last 7 Days" data={chartData?.weekly} />
          </TabsContent>
          
          <TabsContent value="monthly">
            <ChartCard title="Monthly Top Tracks" period="Last 30 Days" data={chartData?.monthly} />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {chartData && (
            <>
              <VisualizationCard chartData={chartData[period]} period={period} />
              <ChartMovementStats chartData={chartData[period]} period={period} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Charts;
