
import React from 'react';
import { fontFamilies } from './ThemeOptions';
import { FontFamily } from '@/types/theme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontFamilySelectorProps {
  currentFontFamily: FontFamily;
  onChange: (fontFamily: FontFamily) => void;
}

export const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({ 
  currentFontFamily, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Font Family <span className="text-muted-foreground">(Current: {currentFontFamily})</span></label>
      <Select 
        value={currentFontFamily} 
        onValueChange={(value) => onChange(value as FontFamily)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem 
              key={font.value} 
              value={font.value}
              className={`font-${font.value}`}
            >
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
