/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const shouldLintOrTypeCheck = !isProduction

module.exports = {
  eslint: {
    enable: shouldLintOrTypeCheck,
    pluginOptions(eslintConfig) {
      return Object.assign(eslintConfig, {
        cache: true,
        cacheLocation: 'node_modules/.cache/eslint/',
      })
    },
  },
  typescript: {
    enableTypeChecking: shouldLintOrTypeCheck,
  },
  webpack: {
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: ['console'],
      }),
    ],
    configure: (webpackConfig) => {
      webpackConfig.resolve = Object.assign(webpackConfig.resolve, {
        fallback: {
          net: false,
          tls: false,
          fs: false,
        },
      })

      webpackConfig.optimization = Object.assign(
        webpackConfig.optimization,
        isProduction
          ? {
              splitChunks: {
                // Cap the chunk size to 5MB.
                // react-scripts suggests a chunk size under 1MB after gzip, but we can only measure maxSize before gzip.
                // react-scripts also caps cacheable chunks at 5MB, which gzips to below 1MB, so we cap chunk size there.
                // See https://github.com/facebook/create-react-app/blob/d960b9e/packages/react-scripts/config/webpack.config.js#L713-L716.
                maxSize: 5 * 1024 * 1024,
                // Optimize over all chunks, instead of async chunks (the default), so that initial chunks are also optimized.
                chunks: 'all',
              },
            }
          : {}
      )

      return webpackConfig
    },
  },
}
