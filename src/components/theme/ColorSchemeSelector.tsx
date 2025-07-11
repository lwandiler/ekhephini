
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
      <label className="text-sm font-medium">Color Scheme</label>
      <div className="grid grid-cols-3 gap-2">
        {colorSchemes.map((scheme) => (
          <Button
            key={scheme.value}
            variant={currentColorScheme === scheme.value ? "default" : "outline"}
            className={`${
              scheme.value === currentColorScheme 
                ? `bg-gradient-to-r ${scheme.gradientClasses} text-white` 
                : `bg-gradient-to-r ${scheme.gradientClasses} bg-clip-text text-transparent border`
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
