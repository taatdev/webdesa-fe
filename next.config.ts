import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  turbo: {
    rules: {},
    resolveAlias: {},
    resolveExtensions: [],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    turbo: {
      resolveAlias: {},
    },
  },
};

export default nextConfig;
