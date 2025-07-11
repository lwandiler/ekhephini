
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
      <h3 className="text-lg font-medium text-gray-900">No banners added yet</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding your first banner to the homepage carousel.</p>
      <Button
        onClick={onAddNew}
        className="mt-4 bg-radio-accent hover:bg-radio-accent/80"
      >
        Add Your First Banner
      </Button>
    </div>
  );
};

export default EmptyState;
