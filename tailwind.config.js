/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tierra: '#6B4226',
        arcilla: '#C4855A',
        musgo: '#4A7C59',
        hoja: '#7EBF8E',
        cielo: '#A8D8EA',
        sol: '#F2B705',
        niebla: '#F5EFE6',
        noche: '#1A2E1F',
        accent: '#E8472A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
