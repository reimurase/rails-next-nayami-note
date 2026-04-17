import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:3000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
