// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // On définit 'Inter' comme police par défaut pour tout le texte
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Notre palette de couleurs personnalisée
      colors: {
        primary: {
          '500': '#3b82f6', // blue-500
          '600': '#2563eb', // blue-600
          '700': '#1d4ed8', // blue-700
        },
        neutral: { 
          '600': '#52525b',
          '900': '#111827'
        }
      }
    },
  },
  plugins: [],
}