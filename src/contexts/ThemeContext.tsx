
import React, { createContext, useState, useEffect } from "react";
import { ThemeOptions } from "@/types/theme";
import { 
  loadThemeFromStorage, 
  saveThemeToStorage, 
  applyThemeToDocument 
} from "@/utils/themeManager";

// Define the default theme options with green as primary color
const defaultThemeOptions = {
  type: 'modern' as const,
  fontFamily: 'inter' as const,
  fontSize: 'medium' as const,
  colorScheme: 'green' as const
};

// Create the theme context with correct typing
export const ThemeContext = createContext<{
  themeOptions: ThemeOptions;
  setThemeOptions: React.Dispatch<React.SetStateAction<ThemeOptions>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  themeOptions: defaultThemeOptions,
  setThemeOptions: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(defaultThemeOptions);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Default to true for dark mode

  useEffect(() => {
    // Load the theme from localStorage on mount
    const savedTheme = loadThemeFromStorage();
    if (savedTheme) {
      setThemeOptions(savedTheme);
      
      // Apply theme immediately after loading from localStorage
      applyThemeToDocument(savedTheme);
    } else {
      // Apply default theme if no saved theme
      applyThemeToDocument(defaultThemeOptions);
    }
    
    // Load dark mode preference but default to true if not set
    const darkModePref = localStorage.getItem('clickRadioDarkMode');
    if (darkModePref) {
      setIsDarkMode(darkModePref === 'true');
    } else {
      // Default to dark mode
      setIsDarkMode(true);
      localStorage.setItem('clickRadioDarkMode', 'true');
    }
  }, []);

  // Apply theme changes when themeOptions change
  useEffect(() => {
    // Save to localStorage
    saveThemeToStorage(themeOptions);
    
    // Apply theme to document
    applyThemeToDocument(themeOptions);
  }, [themeOptions]);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('clickRadioDarkMode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ themeOptions, setThemeOptions, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
