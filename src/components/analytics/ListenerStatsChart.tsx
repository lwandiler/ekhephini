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

// Sample data
const data = [
  { date: 'May 1', listeners: 12400, newListeners: 1240 },
  { date: 'May 2', listeners: 14800, newListeners: 2450 },
  { date: 'May 3', listeners: 18200, newListeners: 3400 },
  { date: 'May 4', listeners: 16900, newListeners: 2100 },
  { date: 'May 5', listeners: 21500, newListeners: 4600 },
  { date: 'May 6', listeners: 22100, newListeners: 3200 },
  { date: 'May 7', listeners: 24800, newListeners: 2700 },
];

const config = {
  listeners: {
    label: 'Total Listeners',
    theme: {
      light: '#047857',
      dark: '#059669',
    },
  },
  newListeners: {
    label: 'New Listeners',
    theme: {
      light: '#10b981',
      dark: '#34d399',
    },
  },
};

const ListenerStatsChart = () => {
  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
            dataKey="listeners"
            stroke="var(--color-listeners, #8b5cf6)"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="newListeners"
            stroke="var(--color-newListeners, #10b981)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ListenerStatsChart;
