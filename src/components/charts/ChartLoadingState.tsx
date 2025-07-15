
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ListMusic } from 'lucide-react';

const ChartLoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-pulse text-center">
          <ListMusic className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <p className="text-lg text-white dark:text-white">Loading charts data...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChartLoadingState;
