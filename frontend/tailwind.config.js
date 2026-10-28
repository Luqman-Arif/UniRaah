/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          DEFAULT: '#4f46e5', // Primary indigo #4F46E5
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        navy: {
          DEFAULT: '#172033', // Dark navy #172033
          900: '#172033',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        page: '#f8fafc',       // Page background #F8FAFC
        surface: '#ffffff',    // White surface #FFFFFF
        border: {
          DEFAULT: '#e2e8f0',  // Border #E2E8F0
          strong: '#cbd5e1',
        },
        muted: {
          DEFAULT: '#64748b',  // Muted text #64748B
          foreground: '#64748b',
        },
        success: {
          DEFAULT: '#15803d',  // Success #15803D
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          700: '#15803d',
          800: '#166534',
        },
        warning: {
          DEFAULT: '#b45309',  // Warning #B45309
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          700: '#b45309',
          800: '#92400e',
        },
        error: {
          DEFAULT: '#b91c1c',  // Error #B91C1C
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          700: '#b91c1c',
          800: '#991b1b',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
        'badge': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgb(23 32 51 / 0.05), 0 1px 2px -1px rgb(23 32 51 / 0.05)',
        'elevated': '0 4px 6px -1px rgb(23 32 51 / 0.07), 0 2px 4px -2px rgb(23 32 51 / 0.05)',
        'dropdown': '0 10px 15px -3px rgb(23 32 51 / 0.08), 0 4px 6px -4px rgb(23 32 51 / 0.04)',
        'modal': '0 20px 25px -5px rgb(23 32 51 / 0.1), 0 8px 10px -6px rgb(23 32 51 / 0.06)',
      },
    },
  },
  plugins: [],
}
