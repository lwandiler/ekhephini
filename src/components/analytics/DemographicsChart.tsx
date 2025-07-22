
import { Skeleton } from '@/components/ui/skeleton';

interface DemographicsChartProps {
  isLoading: boolean;
}

const DemographicsChart = ({ isLoading }: DemographicsChartProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <p className="text-lg font-medium">Demographics data not available</p>
        <p className="text-sm">Demographics require additional privacy compliance</p>
      </div>
    </div>
  );
};

export default DemographicsChart;
