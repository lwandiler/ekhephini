
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TopTracksBarChart from './TopTracksBarChart';
import { TrackData } from '@/types/charts';

interface VisualizationCardProps {
  chartData: TrackData[];
  period: 'weekly' | 'monthly';
}

const VisualizationCard = ({ chartData, period }: VisualizationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white dark:text-white">Top 10 Plays Visualization</CardTitle>
        <CardDescription className="text-gray-200 dark:text-gray-200">
          {period === 'weekly' ? 'Weekly' : 'Monthly'} play count for top songs
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]"> {/* Increased height for better visibility */}
        {chartData && <TopTracksBarChart chartData={chartData} period={period} />}
      </CardContent>
    </Card>
  );
};

export default VisualizationCard;
