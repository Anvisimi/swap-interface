/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/prices',
        destination: 'https://interview.switcheo.com/prices.json',
      },
    ];
  },
}

module.exports = nextConfig