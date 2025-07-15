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

// Sample demographics data
const data = [
  { age: '18-24', male: 1200, female: 1800, other: 400 },
  { age: '25-34', male: 2800, female: 3200, other: 600 },
  { age: '35-44', male: 3500, female: 2900, other: 500 },
  { age: '45-54', male: 2400, female: 2100, other: 300 },
  { age: '55-64', male: 1800, female: 1600, other: 200 },
  { age: '65+', male: 1200, female: 1400, other: 100 },
];

const config = {
  male: {
    label: 'Male',
    theme: {
      light: '#3b82f6',
      dark: '#60a5fa',
    },
  },
  female: {
    label: 'Female',
    theme: {
      light: '#ec4899',
      dark: '#f472b6',
    },
  },
  other: {
    label: 'Other',
    theme: {
      light: '#047857',
      dark: '#059669',
    },
  },
};

const DemographicsChart = () => {
  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="age" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="male" fill="var(--color-male, #3b82f6)" stackId="a" />
          <Bar dataKey="female" fill="var(--color-female, #ec4899)" stackId="a" />
          <Bar dataKey="other" fill="var(--color-other, #10b981)" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default DemographicsChart;
