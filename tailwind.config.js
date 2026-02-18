/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Barlow Condensed', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          900: '#0F172A',
        },
        accent: {
          DEFAULT: '#F97316',
          500: '#F97316',
          600: '#EA580C',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
