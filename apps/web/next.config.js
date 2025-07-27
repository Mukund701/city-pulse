/** @type {import('next').NextConfig} */
const nextConfig = {
  // Re-enabling Strict Mode for best practices
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig