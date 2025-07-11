
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, ArrowRight, Play } from 'lucide-react';
import { TrackData } from '@/types/charts';

interface ChartMovementStatsProps {
  chartData: TrackData[];
  period: 'weekly' | 'monthly';
}

const ChartMovementStats = ({ chartData, period }: ChartMovementStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white dark:text-white">Chart Movement</CardTitle>
        <CardDescription className="text-gray-200 dark:text-gray-200">
          Song position changes compared to previous {period === 'weekly' ? 'week' : 'month'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-green-900/20 rounded-lg">
            <ArrowUp className="h-8 w-8 text-green-400 mb-2" />
            <p className="text-lg font-semibold text-green-400 dark:text-green-400">
              {chartData?.filter(song => song.movement > 0).length || 0}
            </p>
            <p className="text-sm text-gray-200 dark:text-gray-200">Moving Up</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-red-900/20 rounded-lg">
            <ArrowDown className="h-8 w-8 text-red-400 mb-2" />
            <p className="text-lg font-semibold text-red-400 dark:text-red-400">
              {chartData?.filter(song => song.movement < 0).length || 0}
            </p>
            <p className="text-sm text-gray-200 dark:text-gray-200">Moving Down</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
            <ArrowRight className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-lg font-semibold text-gray-300 dark:text-gray-300">
              {chartData?.filter(song => song.movement === 0).length || 0}
            </p>
            <p className="text-sm text-gray-200 dark:text-gray-200">No Change</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-purple-900/20 rounded-lg">
            <Play className="h-8 w-8 text-purple-400 mb-2" />
            <p className="text-lg font-semibold text-purple-400 dark:text-purple-400">
              {chartData?.filter(song => song.prevPosition === 0).length || 0}
            </p>
            <p className="text-sm text-gray-200 dark:text-gray-200">New Entries</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartMovementStats;
