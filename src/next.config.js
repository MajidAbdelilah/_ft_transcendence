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
  };
  