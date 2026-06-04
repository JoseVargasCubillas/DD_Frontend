/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design principal
        cream: {
          DEFAULT: '#f0ebe2',
          50:  '#faf8f5',
          100: '#f5f0e8',
          200: '#f0ebe2',
          300: '#e8e0d4',
          400: '#d4ccc0',
          500: '#b8ae9f',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#242424',
          500: '#3d3d3d',
          400: '#666666',
          300: '#888888',
          200: '#aaaaaa',
          100: '#cccccc',
          50:  '#f0f0f0',
        },
        // Compatibilidad con páginas internas existentes
        brand: {
          50:  '#fef9ec',
          100: '#fdf0c8',
          200: '#fbde8d',
          300: '#f9c64a',
          400: '#f7af1f',
          500: '#f19007',
          600: '#d56b04',
          700: '#b14a07',
          800: '#8f3a0e',
          900: '#77300f',
          950: '#441704',
        },
        dark: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#242424',
        },
      },
      fontFamily: {
        sans:    ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif:   ['"Libre Baskerville"', 'Baskerville', 'Georgia', 'serif'],
        heading: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.4em',
      },
    },
  },
  plugins: [],
};
