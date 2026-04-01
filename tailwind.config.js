export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 40px rgba(56, 189, 248, 0.18)',
      },
      animation: {
        pulsefast: 'pulse 0.8s ease-in-out infinite',
      },
      colors: {
        surface: '#0b1120',
        panel: '#111827',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
};
