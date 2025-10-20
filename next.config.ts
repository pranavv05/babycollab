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
    position: "bottom-right",
  },
  // Optimize build performance
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-*",
      "@heroicons/react",
      "lucide-react",
      "recharts"
    ]
  },
  // Reduce memory usage during build
  swcMinify: true,
  // Enable webpack 5 for better performance
  future: {
    webpack5: true
  }
}

export default nextConfig