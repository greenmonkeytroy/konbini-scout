import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "proper-goat-247.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
