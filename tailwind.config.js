/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ant-color-primary)',
        success: 'var(--ant-color-success)',
        warning: 'var(--ant-color-warning)',
        error: 'var(--ant-color-error)',
        text: 'var(--ant-color-text)',
        border: 'var(--ant-color-border)',
        bg: 'var(--ant-color-bg-layout)'
      },
      borderRadius: {
        ant: 'var(--ant-border-radius)',
      },
      boxShadow: {
        ant: 'var(--ant-box-shadow-secondary)',
      },
    },
  },
  plugins: [],
};
