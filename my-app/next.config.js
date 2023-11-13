/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**'
      },
      { // temporary, for image links on imgur
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: "/**"
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: "/**"
      }
    ]
  }
}

module.exports = nextConfig
