
import { ThemeType, FontFamily, FontSize, ColorScheme } from "@/types/theme";

export const themeTypes: { type: ThemeType; name: string }[] = [
  { type: 'classic', name: 'Classic' },
  { type: 'modern', name: 'Modern' },
  { type: 'minimalist', name: 'Minimalist' }
];

export const fontFamilies: { value: FontFamily; name: string }[] = [
  { value: 'inter', name: 'Inter' },
  { value: 'roboto', name: 'Roboto' },
  { value: 'playfair', name: 'Playfair Display' }
];

export const fontSizes: { value: FontSize; name: string }[] = [
  { value: 'small', name: 'Small' },
  { value: 'medium', name: 'Medium' },
  { value: 'large', name: 'Large' }
];

export const colorSchemes: { value: ColorScheme; name: string; gradientClasses: string }[] = [
  { value: 'green', name: 'Green', gradientClasses: "from-green-700 to-emerald-700" },
  { value: 'blue', name: 'Blue', gradientClasses: "from-blue-700 to-cyan-700" },
  { value: 'purple', name: 'Purple', gradientClasses: "from-purple-700 to-indigo-700" },
  { value: 'red', name: 'Red', gradientClasses: "from-red-600 to-rose-700" },
  { value: 'orange', name: 'Orange', gradientClasses: "from-orange-500 to-amber-600" },
  { value: 'pink', name: 'Pink', gradientClasses: "from-pink-500 to-purple-500" }
];
