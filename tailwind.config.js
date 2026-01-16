/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#1a1a1a',
        'teal': '#14b8a6',
        'muted': '#6b7280',
      },
      borderRadius: {
        'xlcard': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}