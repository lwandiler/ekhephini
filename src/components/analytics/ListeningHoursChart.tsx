
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface ListeningHoursChartProps {
  data: Array<{ hour: number; listeners: number }>;
  isLoading: boolean;
}

const config = {
  listeners: {
    label: 'Listeners',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
};

const ListeningHoursChart = ({ data, isLoading }: ListeningHoursChartProps) => {
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
          <p className="text-lg font-medium">No listening hours data available</p>
          <p className="text-sm">Start tracking listening events to see hourly patterns</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    listeners: item.listeners
  }));

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="listeners"
            stroke="var(--color-listeners, #8b5cf6)"
            fill="var(--color-listeners, rgba(139, 92, 246, 0.6))"
            name="Listeners"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ListeningHoursChart;
