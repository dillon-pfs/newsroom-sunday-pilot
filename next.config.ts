import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  async redirects() {
    return [
      {
        source: "/bloggers/lead-blogger",
        destination: "/cast/chip-absolute",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
