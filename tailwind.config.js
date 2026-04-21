/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Purples (Primary Buttons)
        'primary': '#7C5DFA',
        'primary-hover': '#9277FF',
        
        // Dark Mode Backgrounds & Elements
        'dark-bg': '#141625',       // Main background in dark mode
        'dark-surface': '#1E2139',  // Cards and sidebar in dark mode
        'dark-surface-hover': '#252945',
        'very-dark': '#0C0E16',
        
        // Light Mode Backgrounds
        'light-bg': '#F8F8FB',
        'light-blue': '#DFE3FA',
        
        // Text & UI Grays
        'gray-blue': '#888EB0',     // Standard text
        'ship-cove': '#7E88C3',     // Secondary text
        
        // Danger/Status Colors
        'danger': '#EC5757',
        'danger-hover': '#FF9797',  // Fixed Figma typo using the RGB values
      },
      fontFamily: {
        'spartan': ['"League Spartan"', 'sans-serif'],
      },
      fontSize: {
        // Mapped exactly to your Typography image specs
        'heading-l': ['36px', { lineHeight: '33px', letterSpacing: '-1px', fontWeight: '700' }],
        'heading-m': ['24px', { lineHeight: '22px', letterSpacing: '-0.75px', fontWeight: '700' }],
        'heading-s': ['15px', { lineHeight: '24px', letterSpacing: '-0.25px', fontWeight: '700' }],
        'body': ['13px', { lineHeight: '18px', letterSpacing: '-0.1px', fontWeight: '500' }],
        'body-variant': ['13px', { lineHeight: '15px', letterSpacing: '-0.25px', fontWeight: '500' }],
      }
    },
  },
  plugins: [],
}