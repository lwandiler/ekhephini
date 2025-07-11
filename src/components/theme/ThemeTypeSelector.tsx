
import React from 'react';
import { Button } from '@/components/ui/button';
import { themeTypes } from './ThemeOptions';
import { ThemeOptions, ThemeType } from '@/types/theme';
import { getGradientClasses } from '@/utils/themeUtils';

interface ThemeTypeSelectorProps {
  currentThemeOptions: ThemeOptions;
  onChange: (type: ThemeType) => void;
}

export const ThemeTypeSelector: React.FC<ThemeTypeSelectorProps> = ({ 
  currentThemeOptions, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Theme Type</label>
      <div className="grid grid-cols-3 gap-2">
        {themeTypes.map((theme) => (
          <Button
            key={theme.type}
            variant={currentThemeOptions.type === theme.type ? "default" : "outline"}
            className={currentThemeOptions.type === theme.type 
              ? `bg-gradient-to-r ${getGradientClasses(currentThemeOptions.colorScheme)} text-white` 
              : ""}
            onClick={() => onChange(theme.type)}
          >
            {theme.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
