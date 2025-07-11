
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
      ))}
    </div>
  );
};

export default LoadingState;
