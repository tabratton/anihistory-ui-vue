const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      orange: colors.orange,
      gray: colors.warmGray
    },
    extend: {
      opacity: {
        65: '.65'
      },
      colors: {
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
