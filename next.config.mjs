/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "118.139.178.174",
      },
      {
        protocol: "https",
        hostname: "galcare.com",
      },
      {
        protocol: "https",
        hostname: "galcare-pharmaceuticals.vercel.app",
      },
    ],
  },
  async rewrites() {
    return []
  },
}

export default nextConfig
