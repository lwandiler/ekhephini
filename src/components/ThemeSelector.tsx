
import { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeContext } from '@/contexts/ThemeContext';
import { ThemeOptions, ThemeType, FontFamily, FontSize, ColorScheme } from '@/types/theme';
import { ThemeTypeSelector } from './theme/ThemeTypeSelector';
import { FontFamilySelector } from './theme/FontFamilySelector';
import { FontSizeSelector } from './theme/FontSizeSelector';
import { ColorSchemeSelector } from './theme/ColorSchemeSelector';
import { applyThemeToDocument, getGradientClasses } from '@/utils/themeUtils';
import { useAuth } from '@/contexts/AuthContext';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  themeOptions?: ThemeOptions;
  onThemeOptionsChange?: (options: Partial<ThemeOptions>) => void;
}

const ThemeSelector = ({ 
  currentTheme, 
  onThemeChange,
  themeOptions = {
    type: 'classic',
    fontFamily: 'inter',
    fontSize: 'medium',
    colorScheme: 'purple'
  },
  onThemeOptionsChange = () => {}
}: ThemeSelectorProps) => {
  // Use the ThemeContext to directly access theme options
  const { themeOptions: contextThemeOptions, setThemeOptions } = useContext(ThemeContext);
  // Get user from auth context
  const { user } = useAuth();
  
  const [localThemeOptions, setLocalThemeOptions] = useState<ThemeOptions>({...themeOptions});
  const [forceShow, setForceShow] = useState(false);
  
  // Check if the current user is an admin using sessionStorage
  useEffect(() => {
    const isAdminUser = sessionStorage.getItem('radioAdminLoggedIn') === 'true';
    setForceShow(!!isAdminUser);
    
    console.log('ThemeSelector: Admin status check:', { isAdmin: !!isAdminUser });
  }, [user]);

  // Force visibility for debugging when in admin mode
  useEffect(() => {
    if (window.location.pathname.includes('admin')) {
      setForceShow(true);
      console.log('ThemeSelector: Forced visible on admin page');
    }
  }, []);
  
  // Log when component is mounted
  useEffect(() => {
    console.log('ThemeSelector: Component mounted');
  }, []);

  // If not forced visible and user isn't admin, don't render
  if (!forceShow && !user) {
    console.log('ThemeSelector: Not rendering - no admin privileges detected');
    return null;
  }
  
  const handleChange = (options: Partial<ThemeOptions>) => {
    const updatedOptions = {...localThemeOptions, ...options};
    setLocalThemeOptions(updatedOptions);
    
    // Apply changes immediately for preview purposes
    applyThemeToDocument(updatedOptions);
  };

  const handleApplyTheme = () => {
    // Apply theme changes to both local state and context
    onThemeOptionsChange(localThemeOptions);
    onThemeChange(localThemeOptions.type);
    
    // Update the theme context directly
    setThemeOptions(localThemeOptions);
    
    // Save to localStorage
    localStorage.setItem('clickRadioTheme', JSON.stringify(localThemeOptions));
    
    // Force document class updates
    applyThemeToDocument(localThemeOptions);
    
    console.log("Theme applied:", localThemeOptions);
  };

  console.log('ThemeSelector: Rendering theme selector', { forceShow });

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              className={`primary-theme-button text-white mb-2 rounded-full flex items-center gap-2 bg-gradient-to-r ${getGradientClasses(localThemeOptions.colorScheme)}`}
            >
              <Paintbrush size={16} />
              Theme Options
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Theme Options</h3>
              
              <ThemeTypeSelector 
                currentThemeOptions={localThemeOptions} 
                onChange={(type) => handleChange({ type })}
              />
              
              <FontFamilySelector 
                currentFontFamily={localThemeOptions.fontFamily} 
                onChange={(fontFamily) => handleChange({ fontFamily })}
              />
              
              <FontSizeSelector 
                currentFontSize={localThemeOptions.fontSize}
                onChange={(fontSize) => handleChange({ fontSize })}
              />
              
              <ColorSchemeSelector 
                currentColorScheme={localThemeOptions.colorScheme}
                onChange={(colorScheme) => handleChange({ colorScheme })}
              />
              
              <div className="pt-2">
                <Button 
                  className={`w-full bg-gradient-to-r ${getGradientClasses(localThemeOptions.colorScheme)} text-white hover:opacity-90`}
                  onClick={handleApplyTheme}
                >
                  Apply Theme
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ThemeSelector;
