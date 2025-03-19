
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
			padding: '1rem',
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
                
                // Warm Gold (primary color)
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    50: '#FFF8E1',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFC928',
                    500: '#FFB400', // Warm Gold
                    600: '#FFA000',
                    700: '#FF8F00',
                    800: '#FF6F00',
                    900: '#FF5722',
                },
                // Deep Navy Blue (secondary color)
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    50: '#E3E9F2',
                    100: '#B9C8DE',
                    200: '#8FA7CA',
                    300: '#6485B5',
                    400: '#3F67A0',
                    500: '#0A2540', // Deep Navy Blue
                    600: '#092138',
                    700: '#071C30',
                    800: '#051628',
                    900: '#021120',
                },
                // Warm Gold (accent color)
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    50: '#FFF8E1',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFC928',
                    500: '#FFB400', // Warm Gold
                    600: '#FFA000',
                    700: '#FF8F00',
                    800: '#FF6F00',
                    900: '#FF5722',
                },
                // Cool Light Gray
                gray: {
                    50: '#FAFAFA',
                    100: '#F8F8F8',
                    200: '#F5F5F5',
                    300: '#F2F2F2', // Cool Light Gray
                    400: '#EEEEEE',
                    500: '#E0E0E0',
                    600: '#BDBDBD',
                    700: '#9E9E9E',
                    800: '#757575',
                    900: '#616161',
                },
                // Charcoal Gray
                charcoal: {
                    50: '#E6E6E6',
                    100: '#CCCCCC',
                    200: '#B3B3B3',
                    300: '#999999',
                    400: '#666666',
                    500: '#333333', // Charcoal Gray
                    600: '#292929',
                    700: '#1F1F1F',
                    800: '#141414',
                    900: '#0A0A0A',
                },
                // Soft Mint Green
                mint: {
                    50: '#E8F7ED',
                    100: '#D1F0DB',
                    200: '#BAE8C9',
                    300: '#A7E3BE', // Soft Mint Green
                    400: '#8ED9AE',
                    500: '#75CF9E',
                    600: '#5CB88E',
                    700: '#42A17E',
                    800: '#29896E',
                    900: '#0F725E',
                },
                // Deep Navy Blue
                navy: {
                    50: '#E3E9F2',
                    100: '#B9C8DE',
                    200: '#8FA7CA',
                    300: '#6485B5',
                    400: '#3F67A0',
                    500: '#0A2540', // Deep Navy Blue
                    600: '#092138',
                    700: '#071C30',
                    800: '#051628',
                    900: '#021120',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.3s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'slide-down': 'slide-down 0.4s ease-out',
                'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
                'scale-in': 'scale-in 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
