
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

// Sample listening hours data (24-hour format)
const data = [
  { hour: '00:00', listeners: 1200, weekday: 850, weekend: 1600 },
  { hour: '02:00', listeners: 880, weekday: 600, weekend: 1200 },
  { hour: '04:00', listeners: 520, weekday: 480, weekend: 560 },
  { hour: '06:00', listeners: 950, weekday: 1100, weekend: 800 },
  { hour: '08:00', listeners: 2450, weekday: 3200, weekend: 1700 },
  { hour: '10:00', listeners: 3850, weekday: 4500, weekend: 3200 },
  { hour: '12:00', listeners: 4120, weekday: 4800, weekend: 3450 },
  { hour: '14:00', listeners: 3670, weekday: 4200, weekend: 3150 },
  { hour: '16:00', listeners: 4320, weekday: 4950, weekend: 3700 },
  { hour: '18:00', listeners: 5420, weekday: 5800, weekend: 5050 },
  { hour: '20:00', listeners: 4850, weekday: 4500, weekend: 5200 },
  { hour: '22:00', listeners: 2970, weekday: 2400, weekend: 3550 },
];

const config = {
  weekday: {
    label: 'Weekday',
    theme: {
      light: '#8b5cf6',
      dark: '#a78bfa',
    },
  },
  weekend: {
    label: 'Weekend',
    theme: {
      light: '#ec4899',
      dark: '#f472b6',
    },
  },
};

const ListeningHoursChart = () => {
  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
            dataKey="weekday"
            stackId="1"
            stroke="var(--color-weekday, #8b5cf6)"
            fill="var(--color-weekday, rgba(139, 92, 246, 0.6))"
          />
          <Area
            type="monotone"
            dataKey="weekend"
            stackId="2"
            stroke="var(--color-weekend, #ec4899)"
            fill="var(--color-weekend, rgba(236, 72, 153, 0.6))"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ListeningHoursChart;
