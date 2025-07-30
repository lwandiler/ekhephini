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
					DEFAULT: 'hsl(222 84% 30%)', // Site blue #004995
					foreground: 'hsl(0 0% 100%)' // White
				},
				secondary: {
					DEFAULT: 'hsl(222 84% 30%)', // Site blue #004995
					foreground: 'hsl(0 0% 100%)' // White
				},
				destructive: {
					DEFAULT: 'hsl(222 84% 30%)', // Site blue #004995
					foreground: 'hsl(0 0% 100%)' // White
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(222 84% 30%)', // Site blue #004995
					foreground: 'hsl(0 0% 100%)' // White
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
					primary: 'hsl(222 84% 30%)', // Site blue #004995
					'primary-foreground': 'hsl(0 0% 100%)', // White
					accent: 'hsl(222 84% 30%)', // Site blue #004995
					'accent-foreground': 'hsl(0 0% 100%)', // White
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				radio: {
					'blue': 'hsl(222 84% 5%)',        // #0f172a converted to HSL
					'light-blue': 'hsl(220 39% 11%)', // #1e293b converted to HSL
					'accent': 'hsl(222 84% 30%)',     // Site blue #004995
					'light': 'hsl(210 40% 98%)',      // #f8fafc converted to HSL
					'muted': 'hsl(214 32% 65%)'       // #94a3b8 converted to HSL
				},
				clickradio: {
					'primary': 'hsl(222 84% 30%)', // Site blue #004995
					'secondary': 'hsl(222 84% 40%)', // Lighter blue
					'accent': 'hsl(222 84% 50%)', // Even lighter blue
					'light': '#F3F4F6', // gray-100
					'dark': '#1E1B4B', // indigo-900
					'text': '#4B5563', // gray-600
					// Color scheme colors - all blue variants
					'blue-primary': 'hsl(222 84% 30%)', // Site blue #004995
					'blue-secondary': 'hsl(222 84% 40%)', // Lighter blue
					'green-primary': 'hsl(222 84% 30%)', // Site blue #004995
					'green-secondary': 'hsl(222 84% 40%)', // Lighter blue
					'red-primary': 'hsl(222 84% 30%)', // Site blue #004995
					'red-secondary': 'hsl(222 84% 40%)', // Lighter blue
					'orange-primary': 'hsl(222 84% 30%)', // Site blue #004995
					'orange-secondary': 'hsl(222 84% 40%)', // Lighter blue
					'pink-primary': 'hsl(222 84% 30%)', // Site blue #004995
					'pink-secondary': 'hsl(222 84% 40%)', // Lighter blue
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
				'asap': ['Asap', 'sans-serif'],
			},
			fontSize: {
				'size-small': ['0.875rem', '1.25rem'],      // Small
				'size-medium': ['1rem', '1.5rem'],          // Medium (default)
				'size-large': ['1.125rem', '1.75rem'],      // Large
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
