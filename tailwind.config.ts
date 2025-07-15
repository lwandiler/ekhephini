
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				radio: {
					'blue': 'hsl(222 84% 5%)',        // #0f172a converted to HSL
					'light-blue': 'hsl(220 39% 11%)', // #1e293b converted to HSL  
					'accent': 'hsl(199 89% 48%)',     // #0ea5e9 converted to HSL
					'light': 'hsl(210 40% 98%)',      // #f8fafc converted to HSL
					'muted': 'hsl(214 32% 65%)'       // #94a3b8 converted to HSL
				},
				clickradio: {
					'primary': '#047857', // green-700 (changed from purple)
					'secondary': '#059669', // emerald-700 (changed from indigo)
					'accent': '#A7F3D0', // emerald-200 (changed from purple-300)
					'light': '#F3F4F6', // gray-100
					'dark': '#1E1B4B', // indigo-900
					'text': '#4B5563', // gray-600
					// Color scheme colors
					'blue-primary': '#1E40AF', // blue-700
					'blue-secondary': '#0891B2', // cyan-700
					'green-primary': '#047857', // green-700
					'green-secondary': '#059669', // emerald-700
					'red-primary': '#DC2626', // red-600
					'red-secondary': '#9F1239', // rose-700
					'orange-primary': '#F97316', // orange-500
					'orange-secondary': '#D97706', // amber-600
					'pink-primary': '#EC4899', // pink-500
					'pink-secondary': '#8B5CF6', // purple-500
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 2s ease-in-out infinite'
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
				'playfair': ['Playfair Display', 'serif'],
			},
			fontSize: {
				'size-small': ['0.875rem', '1.25rem'],      // Small
				'size-medium': ['1rem', '1.5rem'],          // Medium (default)
				'size-large': ['1.125rem', '1.75rem'],      // Large
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
