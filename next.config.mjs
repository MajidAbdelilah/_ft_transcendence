/** @type {import('next').NextConfig} */
const nextConfig = {
    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    compiler: {
        styledComponents: true,
        ignoreBuildErrors: true,
      },
      experimental: {
        // This will ignore HTML validation warnings
        strictNextHead: false,
      }
    
};

export default nextConfig;
