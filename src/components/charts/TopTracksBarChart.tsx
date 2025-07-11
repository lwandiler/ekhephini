
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TrackData } from '@/types/charts';

interface TopTracksBarChartProps {
  chartData: TrackData[];
  period: 'weekly' | 'monthly';
}

const TopTracksBarChart = ({ chartData, period }: TopTracksBarChartProps) => {
  return (
    <div className="h-full">
      <ChartContainer
        config={{
          plays: {
            color: '#a78bfa', // Lighter purple
            label: 'Play Count',
          },
        }}
        className="h-full w-full" // Ensure chart uses all available space
      >
        <BarChart 
          data={chartData.slice(0, 10).map(song => ({
            name: song.title.length > 15 ? song.title.substring(0, 15) + '...' : song.title,
            plays: song.plays
          }))}
          margin={{ top: 20, right: 30, left: 30, bottom: 100 }} // Increased bottom margin for labels
        >
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={120} // Increased height for X-axis labels
            tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 700 }} // Bolder, larger font
            tickLine={{ stroke: "#ffffff", strokeWidth: 2 }} // More visible tick lines
            axisLine={{ stroke: "#ffffff", strokeWidth: 2 }} // More visible axis line
          />
          <YAxis 
            stroke="#ffffff" 
            strokeWidth={2} // More visible Y-axis line
            tick={{ fill: "#ffffff", fontSize: 14, fontWeight: 600 }} // Bolder, larger font
            tickLine={{ stroke: "#ffffff", strokeWidth: 2 }} // More visible tick lines
            axisLine={{ stroke: "#ffffff", strokeWidth: 2 }} // More visible axis line
          />
          <ChartTooltip
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [value, 'Plays']}
                className="bg-gray-800 border-purple-500 text-white" // Ensuring tooltip is visible
              />
            }
          />
          <Bar dataKey="plays" fill="var(--color-plays)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TopTracksBarChart;
