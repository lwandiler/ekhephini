
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface ListenerStatsChartProps {
  data: Array<{ date: string; total_unique_visitors: number; total_sessions: number }>;
  isLoading: boolean;
}

const config = {
  total_unique_visitors: {
    label: 'Unique Visitors',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
  total_sessions: {
    label: 'Total Sessions',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
};

const ListenerStatsChart = ({ data, isLoading }: ListenerStatsChartProps) => {
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
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">Start collecting analytics data to see listener growth</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: item.total_unique_visitors,
    sessions: item.total_sessions
  }));

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="var(--color-total_unique_visitors, #8b5cf6)"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Unique Visitors"
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="var(--color-total_sessions, #10b981)"
            strokeWidth={2}
            name="Total Sessions"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ListenerStatsChart;
