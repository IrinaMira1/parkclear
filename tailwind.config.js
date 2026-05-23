export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parking: {
          verified: '#22c55e',
          estimated: '#eab308',
          needs_scan: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
