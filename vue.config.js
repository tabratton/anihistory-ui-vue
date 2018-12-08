module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  configureWebpack: config => {
    config.performance = {}
    if (process.env.NODE_ENV === 'production') {
      config.performance.hints = 'warning'
    } else {
      config.performance.hints = false
    }
  }
}
