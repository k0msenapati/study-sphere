/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for development speed
  swcMinify: true,
  
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', 'react-icons']
  },
  
  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce memory usage in development
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
