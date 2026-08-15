import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://mc-heads.net/avatar/**"),
      // Discord profile pictures, from the OAuth identity.
      new URL("https://cdn.discordapp.com/**"),
    ],
  },
};

export default nextConfig;
