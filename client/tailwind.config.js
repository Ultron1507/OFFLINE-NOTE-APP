/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        dark: '#0f0f0f',
        card: '#1a1a1a',
      }
    },
  },
  plugins: [],
};
