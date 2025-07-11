
import React from "react";
import { cn } from "@/lib/utils";

interface CarouselIndicatorsProps {
  count: number;
  currentIndex: number;
  onClick: (index: number) => void;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({ 
  count, 
  currentIndex, 
  onClick 
}) => {
  if (count <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            currentIndex === index 
              ? "bg-white w-10" 
              : "bg-white/40 hover:bg-white/80"
          )}
          onClick={() => onClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
