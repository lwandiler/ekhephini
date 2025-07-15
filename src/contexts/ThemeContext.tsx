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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Default to false for light mode

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
    
    // Force light mode (white background)
    setIsDarkMode(false);
    localStorage.setItem('clickRadioDarkMode', 'false');
  }, []);

  // Apply theme changes when themeOptions change
  useEffect(() => {
    // Save to localStorage
    saveThemeToStorage(themeOptions);
    
    // Apply theme to document
    applyThemeToDocument(themeOptions);
  }, [themeOptions]);
  
  // Apply light mode class to document (remove dark)
  useEffect(() => {
    // Always remove dark mode class for white background
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = 'white';
    
    // Save preference to localStorage
    localStorage.setItem('clickRadioDarkMode', 'false');
  }, [isDarkMode]);

  // Function to toggle dark mode (disabled for white background)
  const toggleDarkMode = () => {
    // Keep it light mode
    setIsDarkMode(false);
  };

  return (
    <ThemeContext.Provider value={{ themeOptions, setThemeOptions, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
