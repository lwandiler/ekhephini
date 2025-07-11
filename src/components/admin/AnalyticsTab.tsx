
import React from 'react';
import { Button } from '@/components/ui/button';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Last 7 Days</Button>
          <Button variant="outline" size="sm">Last 30 Days</Button>
          <Button variant="outline" size="sm">This Year</Button>
          <Button variant="outline" size="sm" className="bg-radio-accent text-white hover:bg-radio-accent/80">All Time</Button>
        </div>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsTab;
