/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b2e59',
          blue: '#164a87',
          cream: '#f8fafc',
          gold: '#f4b942',
          sky: '#dbeafe',
        },
      },
      boxShadow: {
        card: '0 18px 50px rgba(11, 46, 89, 0.08)',
      },
      fontSize: {
        base: ['18px', '1.6'],
      },
    },
  },
  plugins: [],
}
