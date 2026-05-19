/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
