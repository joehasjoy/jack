'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/baseResources': {
      //   target: 'http://10.4.93.142:8888/',
      //   changeOrigin: true
      // },
      // '/instances': {
      //   target: 'http://qingyun-web.dev.ennewi.cn',
      //   changeOrigin: true
      // },
      '/oyo-sso': {
        target: 'http://ali-dev.ahotels.tech/',
        changeOrigin: true
      },
      '/cmdb': {
        target: 'http://10.201.20.127:5000/',
        changeOrigin: true,
        pathRewrite: {
          '^/cmdb': ''   //需要rewrite重写的,
        }
      },
      '/ops-auth': {
        // target: 'http://10.201.20.139:5000/',
        // target: 'http://192.168.21.138:5005/',      // dev env
        target: 'http://127.0.0.1:5005/',      // dev env
        // target: 'http://ops-tools.ahotels.tech/ops-auth',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/ops-auth': ''   //需要rewrite重写的,
        }
      },
      '/ws': {
        // target: 'http://10.201.20.139:5000/',
        // target: 'http://192.168.21.138:5005/',      // dev env
        target: 'http://127.0.0.1:5005/',      // dev env
        // target: 'http://ops-tools.ahotels.tech/ops-auth',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/ws': ''   //需要rewrite重写的,
        }
      },

    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
