
import React from 'react';
import { fontSizes } from './ThemeOptions';
import { FontSize } from '@/types/theme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSizeSelectorProps {
  currentFontSize: FontSize;
  onChange: (fontSize: FontSize) => void;
}

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ 
  currentFontSize, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Font Size <span className="text-muted-foreground">(Current: {currentFontSize})</span></label>
      <Select 
        value={currentFontSize} 
        onValueChange={(value) => onChange(value as FontSize)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200">
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
