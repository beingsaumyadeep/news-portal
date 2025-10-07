/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Optimizes for Docker deployments
  images: {
    domains: [
      'images.unsplash.com',
      'static01.nyt.com',
      'media.guim.co.uk',
      'i.guim.co.uk',
      'static.guim.co.uk',
      'assets.guim.co.uk',
      'media-api.guim.co.uk',
    ],
    // Add any other domains you need for images
  },
  // Enable experimental features if needed
  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig
