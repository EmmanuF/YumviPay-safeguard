
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
                
                // Bright Teal Green
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    50: '#e0f7f1',
                    100: '#c1efe3',
                    200: '#83e0c7',
                    300: '#45d1aa',
                    400: '#06c28e',
                    500: '#00A676', // Bright Teal Green
                    600: '#00845e',
                    700: '#006346',
                    800: '#00422f',
                    900: '#002117',
                },
                // Dark Mocha Brown
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    50: '#eee8e6',
                    100: '#ddd1cd',
                    200: '#bba39b',
                    300: '#997569',
                    400: '#775c52',
                    500: '#5D4037', // Dark Mocha Brown
                    600: '#4a332c',
                    700: '#382721',
                    800: '#251a16',
                    900: '#130d0b',
                },
                // Burnt Orange
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    50: '#fceee4',
                    100: '#faddc9',
                    200: '#f5ba94',
                    300: '#f0975e',
                    400: '#eb7429',
                    500: '#E65100', // Burnt Orange
                    600: '#b84100',
                    700: '#8a3100',
                    800: '#5c2000',
                    900: '#2e1000',
                },
                // Soft Cream
                cream: {
                    50: '#fefefe',
                    100: '#fcfcf3',
                    200: '#faf9e7',
                    300: '#f7f6db',
                    400: '#f6f4d0',
                    500: '#F5F5DC', // Soft Cream
                    600: '#c4c4b0',
                    700: '#939384',
                    800: '#626258',
                    900: '#31312c',
                },
                // Deep Charcoal Black
                charcoal: {
                    50: '#e5e5e5',
                    100: '#cccccc',
                    200: '#999999',
                    300: '#666666',
                    400: '#333333',
                    500: '#212121', // Deep Charcoal Black
                    600: '#1a1a1a',
                    700: '#141414',
                    800: '#0d0d0d',
                    900: '#070707',
                },
                // Mocha colors
                mocha: {
                    50: '#eee8e6',
                    100: '#ddd1cd',
                    200: '#bba39b',
                    300: '#997569',
                    400: '#775c52',
                    500: '#5D4037', // Dark Mocha Brown
                    600: '#4a332c',
                    700: '#382721',
                    800: '#251a16',
                    900: '#130d0b',
                },
                // Teal colors
                teal: {
                    50: '#e0f7f1',
                    100: '#c1efe3',
                    200: '#83e0c7',
                    300: '#45d1aa',
                    400: '#06c28e',
                    500: '#00A676', // Bright Teal Green
                    600: '#00845e',
                    700: '#006346',
                    800: '#00422f',
                    900: '#002117',
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
