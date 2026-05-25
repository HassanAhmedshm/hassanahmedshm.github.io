/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: '#0a0a0a',
        surface: {
          DEFAULT: '#121212',
          hover: '#1a1a1a',
          elevated: '#1e1e1e',
        },
        border: {
          DEFAULT: '#27272a',
          hover: '#3f3f46',
        },
        accent: {
          blue: '#3b82f6',
          amber: '#FF7A00',
        },
        text: {
          primary: '#e5e5e5',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
        },
      },
    },
  },
  plugins: [],
}

