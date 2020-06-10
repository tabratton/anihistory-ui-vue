module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    },
    s3Deploy: {
      awsProfile: 'default',
      region: 'us-east-1',
      bucket: 'anihistory.moe',
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pwa: false,
      enableCloudfront: true,
      cloudfrontId: 'E3RJ815PE513Z4',
      cloudfrontMatchers: '/*',
      uploadConcurrency: 5,
      pluginVersion: '3.0.0'
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
