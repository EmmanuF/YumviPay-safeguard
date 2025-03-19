
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
                
                // Deep Emerald Green (replacing Bright Teal Green)
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    50: '#e0f2ee',
                    100: '#b3e0d6',
                    200: '#80cabb',
                    300: '#4db49f',
                    400: '#269f84',
                    500: '#00704A', // Deep Emerald Green
                    600: '#005f3f',
                    700: '#004d33',
                    800: '#003c28',
                    900: '#002a1c',
                },
                // Rich Espresso Brown (replacing Dark Mocha)
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    50: '#ece9e7',
                    100: '#d9d3cf',
                    200: '#b3a89f',
                    300: '#8c7c6f',
                    400: '#66503f',
                    500: '#3C2A1E', // Rich Espresso Brown
                    600: '#30221a',
                    700: '#251a13',
                    800: '#1a120d',
                    900: '#0d0906',
                },
                // Burnt Orange (kept the same)
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
                // Warm Sand (replacing Soft Cream)
                cream: {
                    50: '#fefcf8',
                    100: '#fcf9f1',
                    200: '#f9f3e4',
                    300: '#f7edd6',
                    400: '#f5e7c9',
                    500: '#F4E1C1', // Warm Sand
                    600: '#c3b49a',
                    700: '#928774',
                    800: '#615a4d',
                    900: '#302d27',
                },
                // Pure Black (replacing Deep Charcoal)
                charcoal: {
                    50: '#e6e6e6',
                    100: '#cccccc',
                    200: '#999999',
                    300: '#666666',
                    400: '#333333',
                    500: '#000000', // Pure Black
                    600: '#000000',
                    700: '#000000',
                    800: '#000000',
                    900: '#000000',
                },
                // Rich Espresso Brown (replacing Mocha Brown)
                mocha: {
                    50: '#ece9e7',
                    100: '#d9d3cf',
                    200: '#b3a89f',
                    300: '#8c7c6f',
                    400: '#66503f',
                    500: '#3C2A1E', // Rich Espresso Brown
                    600: '#30221a',
                    700: '#251a13',
                    800: '#1a120d',
                    900: '#0d0906',
                },
                // Deep Emerald (replacing Teal)
                teal: {
                    50: '#e0f2ee',
                    100: '#b3e0d6',
                    200: '#80cabb',
                    300: '#4db49f',
                    400: '#269f84',
                    500: '#00704A', // Deep Emerald Green
                    600: '#005f3f',
                    700: '#004d33',
                    800: '#003c28',
                    900: '#002a1c',
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
