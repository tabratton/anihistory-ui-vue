const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media',
  theme: {
    colors: {
      main: colors.fuchsia,
      white: colors.white,
      gray: colors.warmGray
    },
    extend: {
      opacity: {
        5: '.05',
        7: '.07',
        8: '.08',
        9: '.09',
        11: '.11',
        12: '.12',
        14: '.14',
        15: '.15',
        16: '.16',
        65: '.65'
      },
      colors: {
        'dark-base': 'rgba(12, 12, 12, 1)',
        'elevation-1': 'rgba(255, 255, 255, 0.04)'
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['hover'],
      ringColor: ['hover']
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] }
}
