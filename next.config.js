/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow access from network devices
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
}

module.exports = nextConfig
