/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base:    '#122324',
        surface: '#2F3A32',
        muted:   '#545748',
        sand:    '#DB9F75',
        copper:  '#804012',
        deep:    '#3E2411',
        'text-primary':   '#F5EFE6',
        'text-secondary': '#B0A090',
        'text-muted':     '#7A6F65',
        'status-approved':  '#4CAF7D',
        'status-pending':   '#E8A838',
        'status-rejected':  '#E05C5C',
        'status-forwarded': '#5B9BD5',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        glass:        '0 8px 32px rgba(0,0,0,0.35)',
        'glass-hover': '0 12px 40px rgba(0,0,0,0.45)',
        copper:       '0 4px 20px rgba(128,64,18,0.4)',
      },
      backgroundImage: {
        'app-gradient': 'radial-gradient(ellipse at top left, #1a3a2a 0%, #122324 40%, #0d1a1b 100%)',
      },
    },
  },
  plugins: [],
}
