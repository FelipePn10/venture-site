import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8EC',
        paper: '#F4F1DF',
        surface: '#EBE7CE',
        ink: '#14201A',
        muted: '#5F6A5C',
        line: '#DCD6B8',
        moss: {
          50: '#F0F2E0', 100: '#DDE2BD', 200: '#BCC885', 300: '#9AAE56',
          400: '#7B9335', 500: '#5D7822', 600: '#465D18', 700: '#324512',
          800: '#22310F', 900: '#17220C'
        },
        mustard: {
          50: '#FAF4D9', 100: '#F2E8B0', 200: '#E8D670', 300: '#DCC03B',
          400: '#CBAB1F', 500: '#A78912', 600: '#7E670F', 700: '#5C4B0B'
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)',  'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-mono)',  'ui-monospace', 'monospace']
      },
      letterSpacing: { tightest: '-0.045em' },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'float-mid':  'float 6s ease-in-out infinite',
        'float-fast': 'float 4.5s ease-in-out infinite',
        'marquee':    'marquee 38s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'pop-in':     'pop-in 600ms cubic-bezier(.2,.8,.2,1) both',
        'tick':       'tick 2.4s ease-in-out infinite'
      },
      keyframes: {
        float:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee:      { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'pulse-soft': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
        'pop-in':     { '0%': { opacity: '0', transform: 'translateY(8px) scale(.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        tick:         { '0%,100%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(4px)' } }
      }
    }
  },
  plugins: []
};

export default config;
