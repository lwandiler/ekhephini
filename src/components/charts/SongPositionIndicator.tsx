
import { ArrowDown, ArrowUp, Minus, Star } from 'lucide-react';

interface SongPositionIndicatorProps {
  prevPosition: number;
  movement: number;
  className?: string;
}

const SongPositionIndicator = ({ prevPosition, movement, className = '' }: SongPositionIndicatorProps) => {
  // New entry (prev position = 0)
  if (prevPosition === 0) {
    return (
      <div className={`flex items-center ${className}`}>
        <Star className="h-4 w-4 text-amber-500 mr-1 flex-shrink-0" />
        <span className="text-sm font-medium text-amber-500">NEW</span>
      </div>
    );
  }

  // Moving up
  if (movement > 0) {
    return (
      <div className={`flex items-center ${className}`}>
        <ArrowUp className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
        <span className="text-sm font-medium text-green-400 dark:text-green-400">+{movement}</span>
      </div>
    );
  }
  
  // Moving down
  if (movement < 0) {
    return (
      <div className={`flex items-center ${className}`}>
        <ArrowDown className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
        <span className="text-sm font-medium text-red-400 dark:text-red-400">{Math.abs(movement)}</span>
      </div>
    );
  }
  
  // No change
  return (
    <div className={`flex items-center ${className}`}>
      <Minus className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
      <span className="text-sm font-medium text-gray-300 dark:text-gray-300">0</span>
    </div>
  );
};

export default SongPositionIndicator;
