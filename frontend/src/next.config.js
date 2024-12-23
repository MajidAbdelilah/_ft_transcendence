// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ['10.12.4.10', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.12.4.10',
        port: '8000',
        pathname: '**',
      }
    ]
  }
};

module.exports = nextConfig;