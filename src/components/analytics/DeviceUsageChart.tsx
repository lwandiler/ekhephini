
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Sample device usage data
const data = [
  { name: 'Mobile', value: 58 },
  { name: 'Desktop', value: 27 },
  { name: 'Tablet', value: 11 },
  { name: 'Smart Speaker', value: 4 },
];

const config = {
  Mobile: {
    label: 'Mobile',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
  Desktop: {
    label: 'Desktop',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
  Tablet: {
    label: 'Tablet',
    theme: {
      light: '#3b82f6', 
      dark: '#60a5fa',
    },
  },
  'Smart Speaker': {
    label: 'Smart Speaker',
    theme: {
      light: '#f59e0b',
      dark: '#fbbf24',
    },
  },
};

const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'];

const DeviceUsageChart = () => {
  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
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
