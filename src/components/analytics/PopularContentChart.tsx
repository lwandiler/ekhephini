
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

// Sample data for popular content
const data = [
  { name: 'Evening Vibes', listeners: 8932, hours: 12450 },
  { name: 'Morning Brew', listeners: 7845, hours: 9856 },
  { name: 'Midday Mix', listeners: 6721, hours: 7890 },
  { name: 'Jazz Club', listeners: 5932, hours: 8750 },
  { name: 'Tech Talk', listeners: 4852, hours: 5430 },
  { name: 'Sports Hour', listeners: 4123, hours: 4980 },
  { name: 'Late Night', listeners: 3689, hours: 6540 },
];

// Reverse data to show highest values at the top
const sortedData = [...data].sort((a, b) => a.listeners - b.listeners);

const config = {
  listeners: {
    label: 'Total Listeners',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
  hours: {
    label: 'Listening Hours',
    theme: {
      light: '#f59e0b',
      dark: '#fbbf24',
    },
  },
};

const PopularContentChart = () => {
  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
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
          <Bar dataKey="listeners" fill="var(--color-listeners, #8b5cf6)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PopularContentChart;
