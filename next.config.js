/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api-dev/:path*',
          destination: 'http://127.0.0.1:8788/api/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
