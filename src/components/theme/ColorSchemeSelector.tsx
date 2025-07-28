
import React from 'react';
import { Button } from '@/components/ui/button';
import { colorSchemes } from './ThemeOptions';
import { ColorScheme } from '@/types/theme';

interface ColorSchemeSelectorProps {
  currentColorScheme: ColorScheme;
  onChange: (colorScheme: ColorScheme) => void;
}

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({ 
  currentColorScheme, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Color Scheme <span className="text-muted-foreground">(Current: {currentColorScheme})</span></label>
      <div className="grid grid-cols-3 gap-2">
        {colorSchemes.map((scheme) => (
          <Button
            key={scheme.value}
            variant={currentColorScheme === scheme.value ? "default" : "outline"}
            className={`relative overflow-hidden ${
              scheme.value === currentColorScheme 
                ? `bg-gradient-to-r ${scheme.gradientClasses} text-white border-2 border-white shadow-lg` 
                : `bg-gradient-to-r ${scheme.gradientClasses} text-white hover:opacity-90 transition-opacity`
            }`}
            onClick={() => onChange(scheme.value)}
          >
            {scheme.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
