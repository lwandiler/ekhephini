
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface PopularContentChartProps {
  data: Array<{ show_name: string; total_listeners: number; total_listening_time: number }>;
  isLoading: boolean;
}

const config = {
  total_listeners: {
    label: 'Total Listeners',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
};

const PopularContentChart = ({ data, isLoading }: PopularContentChartProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No show data available</p>
          <p className="text-sm">Start tracking show listening data to see popular content</p>
        </div>
      </div>
    );
  }

  const chartData = data
    .sort((a, b) => a.total_listeners - b.total_listeners)
    .slice(0, 7)
    .map(item => ({
      name: item.show_name,
      listeners: item.total_listeners
    }));

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="listeners" 
            fill="var(--color-total_listeners, #8b5cf6)" 
            name="Listeners"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PopularContentChart;
