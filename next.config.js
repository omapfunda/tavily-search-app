/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  serverExternalPackages: ['@prisma/client']
};

module.exports = nextConfig;