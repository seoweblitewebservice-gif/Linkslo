import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/services",
        destination: "/backlinks",
        permanent: true,
      },
      {
        source: "/login/:path*",
        destination: "/track-order",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/track-order",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
