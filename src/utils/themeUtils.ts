
import { ThemeOptions, ColorScheme } from "@/types/theme";

// Helper function to apply theme directly to document
export const applyThemeToDocument = (options: ThemeOptions) => {
  const rootElement = document.documentElement;
  
  // Apply font family
  rootElement.classList.remove('font-inter', 'font-roboto', 'font-playfair');
  rootElement.classList.add(`font-${options.fontFamily}`);
  
  // Apply font size
  rootElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
  rootElement.classList.add(`text-size-${options.fontSize}`);
  
  // Apply color scheme class (to the html element)
  rootElement.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange', 'theme-pink');
  rootElement.classList.add(`theme-${options.colorScheme}`);
  
  // Also apply to body for consistent styling
  document.body.className = `theme-${options.colorScheme}`;
};

export const getGradientClasses = (scheme: ColorScheme): string => {
  const colorSchemes = [
    { value: 'green', gradientClasses: "from-green-700 to-emerald-700" },
    { value: 'blue', gradientClasses: "from-blue-700 to-cyan-700" },
    { value: 'purple', gradientClasses: "from-purple-700 to-indigo-700" },
    { value: 'red', gradientClasses: "from-red-600 to-rose-700" },
    { value: 'orange', gradientClasses: "from-orange-500 to-amber-600" },
    { value: 'pink', gradientClasses: "from-pink-500 to-purple-500" }
  ];
  
  return colorSchemes.find(s => s.value === scheme)?.gradientClasses || "from-green-700 to-emerald-700";
};
