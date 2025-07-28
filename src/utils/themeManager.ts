
import { ThemeOptions } from "@/types/theme";

// Load theme from localStorage
export const loadThemeFromStorage = (): ThemeOptions | null => {
  const savedTheme = localStorage.getItem('clickRadioTheme');
  if (savedTheme) {
    try {
      return JSON.parse(savedTheme);
    } catch (e) {
      console.error("Error parsing saved theme:", e);
      return null;
    }
  }
  return null;
};

// Save theme to localStorage
export const saveThemeToStorage = (theme: ThemeOptions): void => {
  localStorage.setItem('clickRadioTheme', JSON.stringify(theme));
};

// Apply theme to document
export const applyThemeToDocument = (options: ThemeOptions): void => {
  const rootElement = document.documentElement;
  
  // Apply font family
  rootElement.classList.remove('font-inter', 'font-roboto', 'font-playfair');
  rootElement.classList.add(`font-${options.fontFamily}`);
  
  // Apply font size
  rootElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
  rootElement.classList.add(`text-size-${options.fontSize}`);
  
  // Apply color scheme class
  rootElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange', 'theme-pink');
  rootElement.classList.add(`theme-${options.colorScheme}`);
  
  // Also apply to body for consistent styling, preserving any existing classes
  const existingClasses = document.body.className.split(' ').filter(cls => !cls.startsWith('theme-'));
  document.body.className = [...existingClasses, `theme-${options.colorScheme}`].join(' ');
  
  console.log('Theme applied:', options);
};
