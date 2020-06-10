module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    s3Deploy: {
      region: 'us-east-1',
      bucket: 'anihistory.moe',
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      enableCloudfront: true,
      cloudfrontId: 'E3RJ815PE513Z4',
      uploadConcurrency: 5,
      gzip: true
    }
  },
  configureWebpack: config => {
    config.performance = {}
    if (process.env.NODE_ENV === 'production') {
      config.performance.hints = 'warning'
    } else {
      config.performance.hints = false
    }
  },
  chainWebpack: config => {
    config
      .plugin('prefetch')
      .tap(args => {
        return [
          {
            rel: 'prefetch',
            include: 'asyncChunks',
            fileBlacklist: [
              /\.map$/,
              /pdfmake\.[^.]+\.js$/,
              /xlsx\.[^.]+\.js$/,
              /fabric[^.]*\.[^.]+\.js$/,
              /responsivedefaults\.[^.]+\.js$/
            ]
          }
        ]
      })
  }
}
