/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'sans': ['Inter', '"Noto Sans JP"', 'sans-serif'],
      'mono': ['"JetBrains Mono"', '"Noto Sans JP"', 'monospace']
    },
    extend: {},
  },
  plugins: [],
}

