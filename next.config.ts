import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Development server configuration
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
}

export default nextConfig