
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useHomeTheme = () => {
  const { themeOptions, setThemeOptions } = useContext(ThemeContext);

  const handleThemeChange = (newTheme: typeof themeOptions.type) => {
    setThemeOptions({
      ...themeOptions,
      type: newTheme
    });
  };
  
  const handleThemeOptionsChange = (options: Partial<typeof themeOptions>) => {
    setThemeOptions(prev => ({
      ...prev,
      ...options
    }));
  };

  return { 
    themeOptions, 
    handleThemeChange,
    handleThemeOptionsChange
  };
};
