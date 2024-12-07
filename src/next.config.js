// next.config.js
module.exports = {
    async redirects() {
      return [
        {
          source: '/chat',
          destination: '/Chat',
          permanent: true,
        },
      ];
    },
    images: {
      domains: ['127.0.0.1', 'localhost'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/images/**',
        }
      ]
    }
  };
  
  