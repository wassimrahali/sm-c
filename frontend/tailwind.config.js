/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // 👈 important for Angular
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'btn', 'card', 'input', 'rounded-xl-custom',
    'bg-sky-600', 'hover:bg-sky-700'
  ]
};
