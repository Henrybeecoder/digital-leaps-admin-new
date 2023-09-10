/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
      century_gothic: ['Century Gothic', 'sans-serif'],
    },
    extend: {
      colors: {
        mainblue: '#24559C',
        boldblue: '#22319E',
        gray: '#9B9B9B',
        lightblue: '#e8f5fa',
        textblack: '#777',
      },

      gridTemplateColumns: {
        'courses-layout': 'repeat(auto-fit, minmax(250px, 1fr))',
        'small-screens': 'repeat(2, 1fr)',
      },
    },
  },
  plugins: [],
};
