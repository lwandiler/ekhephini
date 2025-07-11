
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'switch' | 'full';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'icon',
  className = '' 
}) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  
  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Switch 
          id="theme-mode" 
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />
        <Label htmlFor="theme-mode" className="cursor-pointer">
          {isDarkMode ? 'Dark' : 'Light'}
        </Label>
      </div>
    );
  }
  
  if (variant === 'full') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Sun className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
        <Switch 
          id="theme-mode" 
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />
        <Moon className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
    );
  }
  
  // Default icon button
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className={`rounded-full ${className} bg-gray-800/50 backdrop-blur-lg border border-gray-700`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-300" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
