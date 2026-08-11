import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://mc-heads.net/avatar/**")],
  },
};

export default nextConfig;
