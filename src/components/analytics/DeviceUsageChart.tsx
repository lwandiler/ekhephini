
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceUsageChartProps {
  data: Array<{ device: string; users: number }>;
  isLoading: boolean;
}

const config = {
  mobile: {
    label: 'Mobile',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
  desktop: {
    label: 'Desktop',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
  tablet: {
    label: 'Tablet',
    theme: {
      light: '#3b82f6', 
      dark: '#60a5fa',
    },
  },
  unknown: {
    label: 'Other',
    theme: {
      light: '#f59e0b',
      dark: '#fbbf24',
    },
  },
};

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'];

const DeviceUsageChart = ({ data, isLoading }: DeviceUsageChartProps) => {
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
          <p className="text-lg font-medium">No device data available</p>
          <p className="text-sm">Start collecting analytics data to see device usage</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.users, 0);
  const chartData = data.map(item => ({
    name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
    value: item.users,
    percentage: Math.round((item.users / total) * 100)
  }));

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default DeviceUsageChart;
