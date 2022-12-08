/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

function hex2rgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Roboto'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ theme, addComponents }) {
      // .set-theme-color plugin
      const colors = theme('colors');

      const setThemeProperties = Object.entries(colors).reduce(
        (acc, [key, value]) => {
          if (typeof value !== 'string' && key !== 'primary') {
            acc[`.set-theme-${key}`] = Object.entries(value).reduce(
              (acc, [k, v]) => {
                acc[`--color-primary-${k}`] = hex2rgb(v).join(' ');
                return acc;
              },
              {},
            );
          }

          return acc;
        },
        {},
      );

      addComponents(setThemeProperties);
    }),
    function ({ matchUtilities, theme }) {
      // .highlight plugin
      // gives a slight shimmer to buttons
      matchUtilities(
        {
          highlight: (value) => ({ boxShadow: `inset 0 1px 0 0 ${value}` }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        },
      );
    },
  ],
};
