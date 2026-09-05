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
        background: 'var(--bg-primary)',
        foreground: 'var(--text-main)',
        card: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--text-main)'
        },
        muted: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-muted)'
        },
        primary: {
          DEFAULT: 'var(--accent-gold)',
          foreground: '#0B0D13'
        },
        border: 'var(--border-color)',
        hover: 'var(--bg-hover)',
        badge: {
          bg: 'var(--badge-bg)',
          border: 'var(--badge-border)'
        },
        legal: {
          onyx: '#0B0D13',
          dark: '#11141E',
          card: '#181C28',
          border: '#2A3042',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          brass: '#C5A059',
          cobalt: '#2563EB',
          emerald: '#059669',
          danger: '#DC2626',
          warning: '#F59E0B',
          parchment: '#FDFBF7',
          parchmentCard: '#F5EFEB',
          ink: '#1F2937'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        pleading: ['"Century Schoolbook"', '"Times New Roman"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
