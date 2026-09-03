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
    // Proxy WordPress admin, login, and REST API requests to the original
    // WordPress server (118.139.178.174). This allows accessing galcare.com/wp-admin
    // seamlessly through Vercel.
    const wpOrigin = (process.env.WORDPRESS_ORIGIN_URL || "http://118.139.178.174").replace(/\/+$/, "")

    return {
      beforeFiles: [
        {
          source: "/wp-admin",
          destination: `${wpOrigin}/wp-admin/`,
        },
        {
          source: "/wp-admin/",
          destination: `${wpOrigin}/wp-admin/`,
        },
        {
          source: "/wp-admin/:path*",
          destination: `${wpOrigin}/wp-admin/:path*`,
        },
        {
          source: "/wp-login.php",
          destination: `${wpOrigin}/wp-login.php`,
        },
        {
          source: "/wp-json/:path*",
          destination: `${wpOrigin}/wp-json/:path*`,
        },
        {
          source: "/wp-content/:path*",
          destination: `${wpOrigin}/wp-content/:path*`,
        },
        {
          source: "/wp-includes/:path*",
          destination: `${wpOrigin}/wp-includes/:path*`,
        },
        {
          source: "/xmlrpc.php",
          destination: `${wpOrigin}/xmlrpc.php`,
        },
      ],
    }
  },
}

export default nextConfig
