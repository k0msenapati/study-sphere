// next.config.mjs

import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,

  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
      "react-icons",
    ],
  },

  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }
    return config;
  },
};

export default withMDX(nextConfig);
