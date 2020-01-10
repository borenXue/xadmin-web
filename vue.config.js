module.exports = {
  devServer: {
    // reference: https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware-options
    proxy: {
      '/_api': {
        target: 'http://localhost:10060',
        changeOrigin: true,
        pathRewrite: {
          '^/_api': '',
        },
        cookieDomainRewrite: {
          '*': '',
        },
      },
    },
  },
};
