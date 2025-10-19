module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Blue-500
        'primary-dark': '#1D4ED8', // Blue-700
        'primary-light': '#60A5FA', // Blue-400
      },
    },
  },
  plugins: [],
}
