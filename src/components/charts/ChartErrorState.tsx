
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ChartErrorState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Charts</CardTitle>
            <CardDescription className="text-white dark:text-white">
              There was an error loading the chart data. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ChartErrorState;
